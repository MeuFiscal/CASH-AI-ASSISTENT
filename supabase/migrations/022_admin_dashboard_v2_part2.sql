-- 022_admin_dashboard_v2_part2.sql
-- Adicionais RPCs para a Dashboard V2

-- 1. admin_get_users_map
CREATE OR REPLACE FUNCTION public.admin_get_users_map()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    IF NOT public.admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        SELECT 
            UPPER(COALESCE(state, 'ND')) as uf,
            COUNT(DISTINCT id) as workspaces,
            COALESCE((SELECT SUM(amount) FROM public.transactions tr WHERE tr.workspace_id IN (SELECT id FROM public.workspaces w2 WHERE UPPER(COALESCE(w2.state, 'ND')) = UPPER(COALESCE(w.state, 'ND')))), 0) as receita,
            (SELECT COUNT(*) FROM public.workspace_members wm WHERE wm.workspace_id IN (SELECT id FROM public.workspaces w2 WHERE UPPER(COALESCE(w2.state, 'ND')) = UPPER(COALESCE(w.state, 'ND')))) as usuarios
        FROM public.workspaces w
        GROUP BY UPPER(COALESCE(state, 'ND'))
        ORDER BY workspaces DESC
        LIMIT 10
    ) t;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 2. admin_get_recent_events
CREATE OR REPLACE FUNCTION public.admin_get_recent_events(p_limit INT DEFAULT 10)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    IF NOT public.admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        SELECT 
            id::text, 
            action as type,
            resource_type as title,
            COALESCE(details::text, action) as description,
            created_at as date
        FROM public.audit_logs
        ORDER BY created_at DESC
        LIMIT p_limit
    ) t;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 3. admin_get_growth_chart
CREATE OR REPLACE FUNCTION public.admin_get_growth_chart(p_period text DEFAULT '30d')
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    v_days INT;
BEGIN
    IF NOT public.admin_check_access() THEN RAISE EXCEPTION 'Acesso negado'; END IF;
    IF p_period = '7d' THEN v_days := 7;
    ELSIF p_period = '30d' THEN v_days := 30;
    ELSIF p_period = '90d' THEN v_days := 90;
    ELSE v_days := 30;
    END IF;

    -- Gera uma série de dias e faz LEFT JOIN para preencher buracos (Simplificado para o SQLite/Postgres pattern)
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        SELECT 
            to_char(d, 'DD/MM') as date,
            (SELECT COUNT(*) FROM auth.users WHERE created_at::date <= d) as usuarios,
            (SELECT COUNT(*) FROM public.workspaces WHERE created_at::date <= d) as workspaces,
            (SELECT COALESCE(SUM(amount), 0) FROM public.transactions WHERE created_at::date <= d AND type = 'INCOME') as receita
        FROM generate_series(CURRENT_DATE - (v_days - 1), CURRENT_DATE, '1 day'::interval) d
        ORDER BY d ASC
    ) t;

    RETURN COALESCE(result, '[]'::json);
END;
$$;
