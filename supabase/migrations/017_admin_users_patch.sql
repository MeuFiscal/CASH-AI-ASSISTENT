-- 017_admin_users_patch.sql
-- Patch SQL (Sprint 6.3.1) para controle administrativo de usuários na tabela user_roles
-- Esta migration apenas adiciona colunas à tabela existente, preservando toda a arquitetura.

-- 1. Adicionar campos administrativos à tabela user_roles
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- Restrição manual via CHECK constraint no lugar de ENUM para não criar tipos customizados
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS valid_account_status,
ADD CONSTRAINT valid_account_status CHECK (
  account_status IN ('active', 'blocked', 'deleted', 'suspended', 'trial_expired', 'payment_pending')
);

-- 2. Atualizar RPC admin_get_users com Paginação e Busca Server-Side
-- Dropar a função antiga sem parâmetros para evitar ambiguidade no PostgREST
DROP FUNCTION IF EXISTS public.admin_get_users();

CREATE OR REPLACE FUNCTION admin_get_users(
    p_search TEXT DEFAULT '',
    p_filters JSONB DEFAULT '{}'::jsonb,
    p_page INT DEFAULT 1,
    p_limit INT DEFAULT 20,
    p_sort_by TEXT DEFAULT 'created_at',
    p_sort_dir TEXT DEFAULT 'desc'
) RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_total INT;
    v_offset INT;
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    v_offset := (p_page - 1) * p_limit;

    -- CTE principal com os joins necessários
    WITH filtered_users AS (
        SELECT 
            u.id,
            COALESCE(u.raw_user_meta_data->>'name', 'Sem Nome') as name,
            u.email,
            COALESCE(u.phone, u.raw_user_meta_data->>'phone', '') as phone,
            ur.role,
            ur.account_status as status,
            u.last_sign_in_at as last_login_at,
            u.created_at,
            (
                SELECT p.name 
                FROM public.workspace_members wm
                JOIN public.subscriptions s ON s.workspace_id = wm.workspace_id
                JOIN public.plans p ON p.id = s.plan_id
                WHERE wm.user_id = u.id
                ORDER BY s.created_at DESC LIMIT 1
            ) as plan_name,
            (
                SELECT wa.status
                FROM public.workspace_members wm
                JOIN public.whatsapp_accounts wa ON wa.workspace_id = wm.workspace_id
                WHERE wm.user_id = u.id
                ORDER BY wa.created_at DESC LIMIT 1
            ) as whatsapp_status,
            (
                SELECT w.name
                FROM public.workspace_members wm
                JOIN public.workspaces w ON w.id = wm.workspace_id
                WHERE wm.user_id = u.id
                ORDER BY w.created_at DESC LIMIT 1
            ) as workspace_name
        FROM auth.users u
        LEFT JOIN public.user_roles ur ON ur.user_id = u.id
        WHERE 
            (p_search = '' OR 
             u.email ILIKE '%' || p_search || '%' OR 
             COALESCE(u.raw_user_meta_data->>'name', '') ILIKE '%' || p_search || '%' OR
             u.id::text ILIKE '%' || p_search || '%')
            AND
            (p_filters->>'status' IS NULL OR p_filters->>'status' = '' OR ur.account_status = p_filters->>'status')
            AND
            (p_filters->>'role' IS NULL OR p_filters->>'role' = '' OR ur.role::text = p_filters->>'role')
    ),
    ordered_users AS (
        SELECT * FROM filtered_users
        ORDER BY 
            CASE WHEN p_sort_by = 'name' AND p_sort_dir = 'asc' THEN name END ASC,
            CASE WHEN p_sort_by = 'name' AND p_sort_dir = 'desc' THEN name END DESC,
            CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'asc' THEN created_at END ASC,
            CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'desc' THEN created_at END DESC,
            CASE WHEN p_sort_by = 'last_login_at' AND p_sort_dir = 'asc' THEN last_login_at END ASC,
            CASE WHEN p_sort_by = 'last_login_at' AND p_sort_dir = 'desc' THEN last_login_at END DESC,
            CASE WHEN p_sort_by NOT IN ('name', 'created_at', 'last_login_at') THEN created_at END DESC
    )
    SELECT COUNT(*) INTO v_total FROM ordered_users;

    SELECT jsonb_build_object(
        'data', COALESCE((
            SELECT jsonb_agg(row_to_json(u))
            FROM (
                SELECT * FROM ordered_users
                LIMIT p_limit OFFSET v_offset
            ) u
        ), '[]'::jsonb),
        'meta', jsonb_build_object(
            'total', v_total,
            'page', p_page,
            'limit', p_limit,
            'total_pages', CEIL(v_total::numeric / p_limit::numeric)
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Atualizar admin_get_user (Drawer 360)
CREATE OR REPLACE FUNCTION admin_get_user(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    SELECT jsonb_build_object(
        'profile', (
            SELECT jsonb_build_object(
                'id', u.id,
                'name', COALESCE(u.raw_user_meta_data->>'name', 'Sem Nome'),
                'email', u.email,
                'phone', COALESCE(u.phone, u.raw_user_meta_data->>'phone', ''),
                'created_at', u.created_at,
                'status', COALESCE(ur.account_status, 'active'),
                'last_login_at', u.last_sign_in_at,
                'role', ur.role
            )
            FROM auth.users u
            LEFT JOIN public.user_roles ur ON ur.user_id = u.id
            WHERE u.id = p_user_id
        ),
        'workspaces', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object('id', w.id, 'name', w.name, 'role', wm.role, 'created_at', w.created_at)
            ), '[]'::jsonb)
            FROM public.workspace_members wm
            JOIN public.workspaces w ON w.id = wm.workspace_id
            WHERE wm.user_id = p_user_id
        ),
        'subscriptions', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object('id', s.id, 'plan_name', p.name, 'status', s.status, 'price', p.price)
            ), '[]'::jsonb)
            FROM public.workspace_members wm
            JOIN public.subscriptions s ON s.workspace_id = wm.workspace_id
            JOIN public.plans p ON p.id = s.plan_id
            WHERE wm.user_id = p_user_id
        ),
        'whatsapp_accounts', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object('id', wa.id, 'phone_number', wa.phone_number, 'status', wa.status)
            ), '[]'::jsonb)
            FROM public.workspace_members wm
            JOIN public.whatsapp_accounts wa ON wa.workspace_id = wm.workspace_id
            WHERE wm.user_id = p_user_id
        ),
        'usage', (
            SELECT jsonb_build_object(
                'ai_tokens', COALESCE((
                    SELECT SUM((m.metadata->'tokens'->>'total')::numeric)
                    FROM public.workspace_members wm
                    JOIN public.messages m ON m.workspace_id = wm.workspace_id
                    WHERE wm.user_id = p_user_id AND m.role = 'assistant'
                ), 0),
                'storage_bytes', COALESCE((
                    SELECT SUM(f.size)
                    FROM public.workspace_members wm
                    JOIN public.files f ON f.workspace_id = wm.workspace_id
                    WHERE wm.user_id = p_user_id
                ), 0),
                'conversations_count', COALESCE((
                    SELECT COUNT(*)
                    FROM public.workspace_members wm
                    JOIN public.conversations c ON c.workspace_id = wm.workspace_id
                    WHERE wm.user_id = p_user_id
                ), 0)
            )
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. admin_block_user
CREATE OR REPLACE FUNCTION admin_block_user(p_user_id UUID, p_reason TEXT DEFAULT '')
RETURNS BOOLEAN AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    UPDATE public.user_roles 
    SET account_status = 'blocked', blocked_reason = p_reason, updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. admin_activate_user
CREATE OR REPLACE FUNCTION admin_activate_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    UPDATE public.user_roles 
    SET account_status = 'active', blocked_reason = NULL, deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. admin_soft_delete_user
CREATE OR REPLACE FUNCTION admin_soft_delete_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    UPDATE public.user_roles 
    SET account_status = 'deleted', deleted_at = NOW(), deleted_by = auth.uid(), updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
