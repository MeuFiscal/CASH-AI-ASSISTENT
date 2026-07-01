-- 015_admin_os_data.sql
-- RPCs para o Admin OS do Cash AI

-- Função auxiliar para validar se o chamador é um administrador
CREATE OR REPLACE FUNCTION admin_check_access()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. admin_get_metrics()
CREATE OR REPLACE FUNCTION admin_get_metrics()
RETURNS JSONB AS $$
DECLARE
    v_total_users INT;
    v_total_workspaces INT;
    v_conversations_today INT;
    v_whatsapp_messages INT;
    v_mrr NUMERIC;
    v_active_subscriptions INT;
    v_ai_tokens_used INT;
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COUNT(*) INTO v_total_users FROM auth.users;
    SELECT COUNT(*) INTO v_total_workspaces FROM public.workspaces;
    
    SELECT COUNT(*) INTO v_conversations_today 
    FROM public.conversations 
    WHERE DATE(created_at) = CURRENT_DATE;

    SELECT COUNT(*) INTO v_whatsapp_messages 
    FROM public.whatsapp_messages 
    WHERE DATE(created_at) = CURRENT_DATE;

    SELECT COALESCE(SUM(p.price), 0) INTO v_mrr 
    FROM public.subscriptions s
    JOIN public.plans p ON p.id = s.plan_id
    WHERE s.status IN ('ACTIVE', 'TRIALING');

    SELECT COUNT(*) INTO v_active_subscriptions 
    FROM public.subscriptions 
    WHERE status IN ('ACTIVE', 'TRIALING');

    -- Simulação de uso de IA extraindo de metadados se existir, senão 0
    SELECT COALESCE(SUM((metadata->'tokens'->>'total')::numeric), 0) INTO v_ai_tokens_used
    FROM public.messages
    WHERE source = 'ai' OR role = 'assistant';

    v_result := jsonb_build_object(
        'total_users', v_total_users,
        'active_users', v_total_users, -- Simplificado por enquanto
        'workspaces', v_total_workspaces,
        'conversations_today', v_conversations_today,
        'whatsapp_messages', v_whatsapp_messages,
        'mrr', v_mrr,
        'active_subscriptions', v_active_subscriptions,
        'ai_tokens_used', v_ai_tokens_used,
        'edge_functions_status', 'operational',
        'database_status', 'operational'
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. admin_get_users()
CREATE OR REPLACE FUNCTION admin_get_users()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', u.id,
            'name', COALESCE(u.raw_user_meta_data->>'name', 'Sem Nome'),
            'email', u.email,
            'phone', COALESCE(u.phone, u.raw_user_meta_data->>'phone', ''),
            'role', COALESCE(ur.role, 'user'),
            'status', COALESCE(u.raw_user_meta_data->>'status', 'ACTIVE'),
            'last_login', u.last_sign_in_at,
            'created_at', u.created_at,
            'plan_name', COALESCE((
                SELECT p.name 
                FROM public.workspace_members wm
                JOIN public.subscriptions s ON s.workspace_id = wm.workspace_id
                JOIN public.plans p ON p.id = s.plan_id
                WHERE wm.user_id = u.id
                ORDER BY s.created_at DESC LIMIT 1
            ), 'Nenhum')
        )
    ), '[]'::jsonb)
    INTO v_result
    FROM auth.users u
    LEFT JOIN public.user_roles ur ON ur.user_id = u.id
    ORDER BY u.created_at DESC;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. admin_get_workspaces()
CREATE OR REPLACE FUNCTION admin_get_workspaces()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', w.id,
            'name', w.name,
            'slug', w.slug,
            'status', w.status,
            'created_at', w.created_at,
            'updated_at', w.updated_at,
            'owner_email', u.email,
            'owner_name', COALESCE(u.raw_user_meta_data->>'name', 'Desconhecido'),
            'member_count', (SELECT COUNT(*) FROM public.workspace_members WHERE workspace_id = w.id),
            'plan_name', COALESCE(p.name, 'Nenhum')
        )
    ), '[]'::jsonb)
    INTO v_result
    FROM public.workspaces w
    JOIN auth.users u ON u.id = w.owner_user_id
    LEFT JOIN public.subscriptions s ON s.workspace_id = w.id AND s.status IN ('ACTIVE', 'TRIALING')
    LEFT JOIN public.plans p ON p.id = s.plan_id
    ORDER BY w.created_at DESC;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. admin_get_whatsapp()
CREATE OR REPLACE FUNCTION admin_get_whatsapp()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', wa.id,
            'workspace_name', w.name,
            'phone_number', wa.phone_number,
            'status', wa.status,
            'last_sync', wa.updated_at,
            'last_message', (
                SELECT created_at 
                FROM public.whatsapp_messages 
                WHERE whatsapp_account_id = wa.id 
                ORDER BY created_at DESC LIMIT 1
            )
        )
    ), '[]'::jsonb)
    INTO v_result
    FROM public.whatsapp_accounts wa
    JOIN public.workspaces w ON w.id = wa.workspace_id
    ORDER BY wa.updated_at DESC;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. admin_get_openai_usage()
CREATE OR REPLACE FUNCTION admin_get_openai_usage()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_tokens_in NUMERIC;
    v_tokens_out NUMERIC;
    v_tokens_total NUMERIC;
    v_estimated_cost NUMERIC;
    v_last_execution TIMESTAMP;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(SUM((metadata->'tokens'->>'prompt')::numeric), 0),
           COALESCE(SUM((metadata->'tokens'->>'completion')::numeric), 0),
           COALESCE(SUM((metadata->'tokens'->>'total')::numeric), 0),
           MAX(created_at)
    INTO v_tokens_in, v_tokens_out, v_tokens_total, v_last_execution
    FROM public.messages
    WHERE metadata ? 'tokens';

    -- Exemplo simples de custo: $0.005 por 1k tokens (GPT-4o) + conversão BRL
    v_estimated_cost := (v_tokens_total / 1000.0) * 0.005 * 5.50; 

    v_result := jsonb_build_object(
        'tokens_in', v_tokens_in,
        'tokens_out', v_tokens_out,
        'tokens_total', v_tokens_total,
        'estimated_cost_brl', v_estimated_cost,
        'models_used', 'gpt-4o',
        'last_execution', v_last_execution,
        'history', (
             SELECT COALESCE(jsonb_agg(
                 jsonb_build_object(
                     'date', DATE(created_at),
                     'tokens', (metadata->'tokens'->>'total')::numeric
                 )
             ), '[]'::jsonb)
             FROM public.messages
             WHERE metadata ? 'tokens'
             AND created_at >= NOW() - INTERVAL '7 days'
        )
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. admin_get_system_health()
CREATE OR REPLACE FUNCTION admin_get_system_health()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    v_result := jsonb_build_object(
        'supabase', 'operational',
        'realtime', 'operational',
        'storage', 'operational',
        'whatsapp', 'operational',
        'openai', 'operational',
        'edge_functions', 'operational',
        'last_errors', '[]'::jsonb
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
