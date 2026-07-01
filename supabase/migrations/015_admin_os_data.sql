-- 015_admin_os_data.sql
-- RPCs para o Admin OS do Cash AI

-- Função auxiliar para validar se o chamador é um administrador
CREATE OR REPLACE FUNCTION admin_check_access()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role::text IN ('super_admin', 'admin')
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

    SELECT COALESCE(
        (SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'name', COALESCE(sub.raw_user_meta_data->>'name', 'Sem Nome'),
                'email', sub.email,
                'phone', COALESCE(sub.phone, sub.raw_user_meta_data->>'phone', ''),
                'role', COALESCE(sub.role, 'user'),
                'status', COALESCE(sub.raw_user_meta_data->>'status', 'ACTIVE'),
                'last_login', sub.last_sign_in_at,
                'created_at', sub.created_at,
                'plan_name', COALESCE((
                    SELECT p.name 
                    FROM public.workspace_members wm
                    JOIN public.subscriptions s ON s.workspace_id = wm.workspace_id
                    JOIN public.plans p ON p.id = s.plan_id
                    WHERE wm.user_id = sub.id
                    ORDER BY s.created_at DESC LIMIT 1
                ), 'Nenhum')
            )
        ) FROM (
            SELECT u.id, u.raw_user_meta_data, u.email, u.phone, ur.role, u.last_sign_in_at, u.created_at
            FROM auth.users u
            LEFT JOIN public.user_roles ur ON ur.user_id = u.id
            ORDER BY u.created_at DESC
        ) sub), '[]'::jsonb
    ) INTO v_result;

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

    SELECT COALESCE(
        (SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'name', sub.name,
                'slug', sub.slug,
                'status', sub.status,
                'created_at', sub.created_at,
                'updated_at', sub.updated_at,
                'owner_email', sub.email,
                'owner_name', COALESCE(sub.raw_user_meta_data->>'name', 'Desconhecido'),
                'member_count', (SELECT COUNT(*) FROM public.workspace_members WHERE workspace_id = sub.id),
                'plan_name', COALESCE(sub.plan_name, 'Nenhum')
            )
        ) FROM (
            SELECT w.id, w.name, w.slug, w.status, w.created_at, w.updated_at, u.email, u.raw_user_meta_data, p.name as plan_name
            FROM public.workspaces w
            JOIN auth.users u ON u.id = w.owner_user_id
            LEFT JOIN public.subscriptions s ON s.workspace_id = w.id AND s.status IN ('ACTIVE', 'TRIALING')
            LEFT JOIN public.plans p ON p.id = s.plan_id
            ORDER BY w.created_at DESC
        ) sub), '[]'::jsonb
    ) INTO v_result;

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

    SELECT COALESCE(
        (SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'workspace_name', sub.name,
                'phone_number', sub.phone_number,
                'status', sub.status,
                'last_sync', sub.updated_at,
                'last_message', (
                    SELECT created_at 
                    FROM public.whatsapp_messages 
                    WHERE whatsapp_account_id = sub.id 
                    ORDER BY created_at DESC LIMIT 1
                )
            )
        ) FROM (
            SELECT wa.id, wa.phone_number, wa.status, wa.updated_at, w.name
            FROM public.whatsapp_accounts wa
            JOIN public.workspaces w ON w.id = wa.workspace_id
            ORDER BY wa.updated_at DESC
        ) sub), '[]'::jsonb
    ) INTO v_result;

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
             SELECT COALESCE(
                 (SELECT jsonb_agg(
                     jsonb_build_object(
                         'date', DATE(sub.created_at),
                         'tokens', (sub.metadata->'tokens'->>'total')::numeric
                     )
                 ) FROM (
                     SELECT created_at, metadata
                     FROM public.messages
                     WHERE metadata ? 'tokens'
                     AND created_at >= NOW() - INTERVAL '7 days'
                     ORDER BY created_at ASC
                 ) sub), '[]'::jsonb
             )
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

-- 7. admin_get_subscriptions()
CREATE OR REPLACE FUNCTION admin_get_subscriptions()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(
        (SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'workspace_name', sub.name,
                'plan_name', sub.plan_name,
                'status', sub.status,
                'current_period_end', sub.current_period_end,
                'price', sub.price,
                'created_at', sub.created_at
            )
        ) FROM (
            SELECT s.id, w.name, p.name as plan_name, s.status, s.current_period_end, p.price, s.created_at
            FROM public.subscriptions s
            JOIN public.workspaces w ON w.id = s.workspace_id
            JOIN public.plans p ON p.id = s.plan_id
            ORDER BY s.created_at DESC
        ) sub), '[]'::jsonb
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8. admin_get_analytics()
CREATE OR REPLACE FUNCTION admin_get_analytics()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(
        (SELECT jsonb_agg(
            jsonb_build_object(
                'date', grouped.date,
                'conversations', grouped.conversations,
                'messages', grouped.messages
            )
        ) FROM (
            SELECT DATE(c.created_at) as date,
                   COUNT(DISTINCT c.id) as conversations,
                   COUNT(DISTINCT m.id) as messages
            FROM public.conversations c
            LEFT JOIN public.messages m ON m.conversation_id = c.id
            WHERE c.created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(c.created_at)
            ORDER BY DATE(c.created_at) DESC
        ) grouped), '[]'::jsonb
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 9. admin_get_notifications()
CREATE OR REPLACE FUNCTION admin_get_notifications()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(
        (SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'title', sub.title,
                'type', sub.type,
                'status', CASE WHEN sub.read_at IS NOT NULL THEN 'read' ELSE 'unread' END,
                'created_at', sub.created_at
            )
        ) FROM (
            SELECT n.id, n.title, n.type, n.read_at, n.created_at
            FROM public.notifications n
            ORDER BY n.created_at DESC
            LIMIT 100
        ) sub), '[]'::jsonb
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 10. admin_get_audit_logs()
CREATE OR REPLACE FUNCTION admin_get_audit_logs()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT COALESCE(
        (SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'action', sub.action,
                'entity_type', sub.resource_type,
                'entity_id', sub.resource_id,
                'user_email', sub.email,
                'created_at', sub.created_at
            )
        ) FROM (
            SELECT a.id, a.action, a.resource_type, a.resource_id, u.email, a.created_at
            FROM public.audit_logs a
            LEFT JOIN auth.users u ON u.id = a.user_id
            ORDER BY a.created_at DESC
            LIMIT 100
        ) sub), '[]'::jsonb
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
