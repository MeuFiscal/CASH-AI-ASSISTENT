-- Garante que os planos exibidos pelo Admin existam antes de criar assinaturas.
INSERT INTO public.plans (id, name, description, price, billing_period, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Gratuito', 'Recursos básicos para iniciar', 0.00, 'mensal', true),
  ('00000000-0000-0000-0000-000000000002', 'Pro (Segundo Cérebro)', 'Acesso completo ao Segundo Cérebro e IA', 29.90, 'mensal', true),
  ('00000000-0000-0000-0000-000000000003', 'Business', 'Recursos avançados e IA privada', 59.90, 'mensal', true),
  ('00000000-0000-0000-0000-000000000004', 'Enterprise / Ilimitado', 'Suporte dedicado e ferramentas exclusivas', 99.90, 'mensal', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  billing_period = EXCLUDED.billing_period,
  is_active = true;

CREATE OR REPLACE FUNCTION public.admin_update_plan(p_user_id UUID, p_plan_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_workspace_id UUID;
BEGIN
  IF NOT public.admin_check_access() THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.plans WHERE id = p_plan_id AND is_active = true) THEN
    RAISE EXCEPTION 'Plano inexistente ou inativo';
  END IF;

  SELECT id INTO v_workspace_id
  FROM public.workspaces
  WHERE owner_user_id = p_user_id
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_workspace_id IS NULL THEN
    RAISE EXCEPTION 'O usuário não possui um workspace ativo';
  END IF;

  UPDATE public.subscriptions
  SET status = 'CANCELED', updated_at = NOW()
  WHERE workspace_id = v_workspace_id
    AND status IN ('ACTIVE', 'TRIALING');

  INSERT INTO public.subscriptions (workspace_id, plan_id, status)
  VALUES (v_workspace_id, p_plan_id, 'ACTIVE');
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_plan(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_plan(UUID, UUID) TO authenticated;

NOTIFY pgrst, 'reload schema';
