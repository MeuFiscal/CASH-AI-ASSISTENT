-- 019_admin_users_actions.sql
-- RPCs para executar as ações dos modais (Alterar Papel, Plano, Bloqueio, etc)

-- 1. Alterar Papel (Role)
CREATE OR REPLACE FUNCTION admin_update_role(p_user_id UUID, p_role TEXT)
RETURNS VOID AS $$
BEGIN
    IF NOT admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, p_role::app_role)
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Alterar Plano (Assinatura do Workspace Principal)
CREATE OR REPLACE FUNCTION admin_update_plan(p_user_id UUID, p_plan_id UUID)
RETURNS VOID AS $$
DECLARE
    v_workspace_id UUID;
BEGIN
    IF NOT admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    -- Localiza o workspace principal do usuário
    SELECT id INTO v_workspace_id
    FROM public.workspaces
    WHERE owner_user_id = p_user_id
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_workspace_id IS NULL THEN
        RAISE EXCEPTION 'O usuário não possui um workspace ativo';
    END IF;

    -- Cancela a assinatura anterior
    UPDATE public.subscriptions 
    SET status = 'CANCELED' 
    WHERE workspace_id = v_workspace_id AND status IN ('ACTIVE', 'TRIALING');

    -- Cria a nova assinatura ativa
    INSERT INTO public.subscriptions (workspace_id, plan_id, status)
    VALUES (v_workspace_id, p_plan_id, 'ACTIVE');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Bloquear Usuário
CREATE OR REPLACE FUNCTION admin_block_user(p_user_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    IF NOT admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    UPDATE public.user_roles 
    SET account_status = 'blocked', blocked_reason = p_reason
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        INSERT INTO public.user_roles (user_id, account_status, blocked_reason)
        VALUES (p_user_id, 'blocked', p_reason);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Desbloquear / Ativar Usuário
CREATE OR REPLACE FUNCTION admin_activate_user(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    IF NOT admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    UPDATE public.user_roles 
    SET account_status = 'active', blocked_reason = NULL, deleted_at = NULL, deleted_by = NULL
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        INSERT INTO public.user_roles (user_id, account_status)
        VALUES (p_user_id, 'active');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Soft Delete (Desativar Conta)
CREATE OR REPLACE FUNCTION admin_soft_delete_user(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    IF NOT admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    UPDATE public.user_roles 
    SET account_status = 'deleted', deleted_at = NOW(), deleted_by = auth.uid()
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        INSERT INTO public.user_roles (user_id, account_status, deleted_at, deleted_by)
        VALUES (p_user_id, 'deleted', NOW(), auth.uid());
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Ver Perfil Completo 360 (User Drawer)
CREATE OR REPLACE FUNCTION admin_get_user(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    SELECT jsonb_build_object(
        'profile', jsonb_build_object(
            'id', u.id,
            'name', COALESCE(u.raw_user_meta_data->>'name', 'Sem Nome'),
            'email', u.email,
            'phone', COALESCE(u.phone, u.raw_user_meta_data->>'phone', ''),
            'role', COALESCE(ur.role, 'user'),
            'status', COALESCE(ur.account_status, 'active'),
            'created_at', u.created_at,
            'last_sign_in_at', u.last_sign_in_at
        ),
        'workspaces', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', w.id,
                'name', w.name,
                'role', wm.role,
                'created_at', w.created_at
            ))
            FROM public.workspace_members wm
            JOIN public.workspaces w ON w.id = wm.workspace_id
            WHERE wm.user_id = p_user_id
        ), '[]'::jsonb),
        'subscriptions', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', s.id,
                'plan_name', p.name,
                'status', s.status,
                'created_at', s.created_at
            ))
            FROM public.workspace_members wm
            JOIN public.subscriptions s ON s.workspace_id = wm.workspace_id
            JOIN public.plans p ON p.id = s.plan_id
            WHERE wm.user_id = p_user_id
        ), '[]'::jsonb)
    ) INTO v_result
    FROM auth.users u
    LEFT JOIN public.user_roles ur ON ur.user_id = u.id
    WHERE u.id = p_user_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
