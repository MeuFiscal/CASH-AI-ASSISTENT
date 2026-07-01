-- 018_admin_workspaces_patch.sql
-- Patch para corrigir a duplicação de workspaces devido a múltiplas assinaturas no histórico

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
            SELECT 
                w.id, 
                w.name, 
                w.slug, 
                w.status, 
                w.created_at, 
                w.updated_at, 
                u.email, 
                u.raw_user_meta_data, 
                (
                    SELECT p.name 
                    FROM public.subscriptions s
                    JOIN public.plans p ON p.id = s.plan_id
                    WHERE s.workspace_id = w.id AND s.status IN ('ACTIVE', 'TRIALING')
                    ORDER BY s.created_at DESC LIMIT 1
                ) as plan_name
            FROM public.workspaces w
            JOIN auth.users u ON u.id = w.owner_user_id
            ORDER BY w.created_at DESC
        ) sub), '[]'::jsonb
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
