-- 021_admin_dashboard_v2.sql
-- Estrutura para Centro de Inteligência, Localização Real e RPCs de Dashboard V2

-- 1. Estrutura de Localização no Workspace
ALTER TABLE public.workspaces 
ADD COLUMN IF NOT EXISTS state VARCHAR(2),
ADD COLUMN IF NOT EXISTS city VARCHAR(255),
ADD COLUMN IF NOT EXISTS country VARCHAR(255) DEFAULT 'Brasil';

-- 2. Índices de Performance para Dashboard
CREATE INDEX IF NOT EXISTS idx_workspaces_created_at ON public.workspaces(created_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON auth.users(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 3. Função: admin_get_kpis_v2()
CREATE OR REPLACE FUNCTION public.admin_get_kpis_v2()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_users INT;
    v_users_today INT;
    v_total_workspaces INT;
    v_workspaces_today INT;
    v_total_mrr DECIMAL(10,2);
    v_total_revenue DECIMAL(10,2);
    v_tokens_today INT;
    v_messages_today INT;
    v_api_calls_today INT;
    v_active_premium INT;
BEGIN
    SELECT COUNT(*) INTO v_total_users FROM auth.users;
    SELECT COUNT(*) INTO v_users_today FROM auth.users WHERE created_at >= CURRENT_DATE;
    
    SELECT COUNT(*) INTO v_total_workspaces FROM public.workspaces;
    SELECT COUNT(*) INTO v_workspaces_today FROM public.workspaces WHERE created_at >= CURRENT_DATE;
    
    SELECT COALESCE(SUM(p.price), 0) INTO v_total_mrr 
    FROM public.subscriptions s
    JOIN public.plans p ON s.plan_id = p.id
    WHERE s.status IN ('ACTIVE', 'TRIALING');
    
    SELECT COALESCE(SUM(amount), 0) INTO v_total_revenue FROM public.transactions WHERE type = 'INCOME';
    
    SELECT COUNT(*) INTO v_active_premium FROM public.subscriptions s JOIN public.plans p ON s.plan_id = p.id WHERE s.status = 'ACTIVE' AND p.price > 0;
    
    SELECT COALESCE(SUM(tokens_used), 0) INTO v_tokens_today FROM public.messages WHERE created_at >= CURRENT_DATE AND sender_type = 'ai';
    SELECT COUNT(*) INTO v_messages_today FROM public.whatsapp_messages WHERE created_at >= CURRENT_DATE;
    
    v_api_calls_today := 0;

    RETURN json_build_object(
        'users', json_build_object('total', v_total_users, 'today', v_users_today),
        'workspaces', json_build_object('total', v_total_workspaces, 'today', v_workspaces_today),
        'premium_subs', v_active_premium,
        'mrr', v_total_mrr,
        'revenue', v_total_revenue,
        'tokens_today', v_tokens_today,
        'messages_today', v_messages_today,
        'api_calls', v_api_calls_today
    );
END;
$$;

-- 4. Função: admin_get_financial_summary()
CREATE OR REPLACE FUNCTION public.admin_get_financial_summary()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_mrr DECIMAL(10,2);
    v_arr DECIMAL(10,2);
    v_ltv DECIMAL(10,2) := 0;
    v_cac DECIMAL(10,2) := 0;
    v_churn DECIMAL(5,2) := 0;
    v_arpu DECIMAL(10,2) := 0;
    v_active_paid INT;
BEGIN
    SELECT COALESCE(SUM(p.price), 0) INTO v_mrr FROM public.subscriptions s JOIN public.plans p ON s.plan_id = p.id WHERE s.status = 'ACTIVE';
    v_arr := v_mrr * 12;
    SELECT COUNT(*) INTO v_active_paid FROM public.subscriptions s JOIN public.plans p ON s.plan_id = p.id WHERE s.status = 'ACTIVE' AND p.price > 0;
    
    IF v_active_paid > 0 THEN
        v_arpu := v_mrr / v_active_paid;
    END IF;
    
    RETURN json_build_object(
        'mrr', v_mrr,
        'arr', v_arr,
        'arpu', v_arpu,
        'ltv', v_ltv,
        'cac', v_cac,
        'churn', v_churn
    );
END;
$$;

-- 5. Função: admin_get_subscription_metrics()
CREATE OR REPLACE FUNCTION public.admin_get_subscription_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_trial INT;
    v_paid INT;
    v_canceled INT;
BEGIN
    SELECT COUNT(*) INTO v_trial FROM public.subscriptions WHERE status = 'TRIALING';
    SELECT COUNT(*) INTO v_paid FROM public.subscriptions s JOIN public.plans p ON s.plan_id = p.id WHERE s.status = 'ACTIVE' AND p.price > 0;
    SELECT COUNT(*) INTO v_canceled FROM public.subscriptions WHERE status = 'CANCELED';
    
    RETURN json_build_object(
        'trial', v_trial,
        'paid', v_paid,
        'canceled', v_canceled
    );
END;
$$;

-- 6. Função: admin_get_whatsapp_metrics()
CREATE OR REPLACE FUNCTION public.admin_get_whatsapp_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sent INT;
    v_received INT;
    v_active_conversations INT;
    v_webhooks INT;
    v_numbers_connected INT;
BEGIN
    SELECT COUNT(*) INTO v_sent FROM public.whatsapp_messages WHERE direction = 'outbound';
    SELECT COUNT(*) INTO v_received FROM public.whatsapp_messages WHERE direction = 'inbound';
    SELECT COUNT(*) INTO v_active_conversations FROM public.conversations WHERE status = 'open';
    v_webhooks := 0; -- mock until webhook table exists
    SELECT COUNT(*) INTO v_numbers_connected FROM public.whatsapp_instances WHERE status = 'connected';
    
    RETURN json_build_object(
        'sent', v_sent,
        'received', v_received,
        'active_conversations', v_active_conversations,
        'webhooks', v_webhooks,
        'numbers_connected', v_numbers_connected
    );
END;
$$;

-- 7. Função: admin_get_top_workspaces()
CREATE OR REPLACE FUNCTION public.admin_get_top_workspaces()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        SELECT w.id, w.name AS empresa, p.name AS plano, 
               (SELECT COUNT(*) FROM public.workspace_members wm WHERE wm.workspace_id = w.id) AS usuarios,
               (SELECT COUNT(*) FROM public.whatsapp_messages msg WHERE msg.workspace_id = w.id) AS mensagens,
               COALESCE((SELECT SUM(tokens_used) FROM public.messages m WHERE m.workspace_id = w.id), 0) AS tokens,
               (SELECT COALESCE(SUM(amount), 0) FROM public.transactions tr WHERE tr.workspace_id = w.id) AS receita,
               w.updated_at AS ultimo_acesso,
               'Ativo' as status
        FROM public.workspaces w
        LEFT JOIN public.subscriptions s ON s.workspace_id = w.id
        LEFT JOIN public.plans p ON p.id = s.plan_id
        ORDER BY receita DESC
        LIMIT 10
    ) t;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 8. Função: admin_get_smart_alerts()
CREATE OR REPLACE FUNCTION public.admin_get_smart_alerts()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- This is a foundational example. A true implementation would query distinct alerting scenarios.
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        SELECT 'Sem pagamento' as type, 'Crítica' as priority, 'Workspace sem assinatura ativa detectado.' as message, created_at as date
        FROM public.workspaces
        WHERE id NOT IN (SELECT workspace_id FROM public.subscriptions WHERE status IN ('ACTIVE', 'TRIALING'))
        LIMIT 5
    ) t;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;
