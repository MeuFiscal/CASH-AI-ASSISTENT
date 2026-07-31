-- Segurança multi-tenant, operações financeiras atômicas e remoção do canal legado.

-- O primeiro administrador deve ser provisionado por um operador com service_role.
REVOKE ALL ON FUNCTION public.bootstrap_super_admin() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_check_access()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role::text IN ('super_admin', 'admin')
      AND COALESCE(account_status, 'active') = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND COALESCE(account_status, 'active') = 'active'
  );
$$;

-- Ninguém pode se associar arbitrariamente a um workspace de terceiro.
DROP POLICY IF EXISTS "Insert own workspace_members" ON public.workspace_members;
CREATE POLICY "Owners can add themselves to owned workspaces"
ON public.workspace_members FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND role = 'owner'
  AND EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = workspace_id AND owner_user_id = auth.uid()
  )
  AND public.is_active_user()
);

-- Apenas superadministradores podem alterar papéis globais.
CREATE OR REPLACE FUNCTION public.admin_update_role(p_user_id UUID, p_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin' AND account_status = 'active'
  ) THEN
    RAISE EXCEPTION 'Apenas um superadministrador pode alterar papéis';
  END IF;

  IF p_role NOT IN ('super_admin', 'admin', 'support', 'user') THEN
    RAISE EXCEPTION 'Papel inválido';
  END IF;

  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Não é permitido alterar o próprio papel';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role::global_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, updated_at = NOW();
END;
$$;

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS transactions_workspace_idempotency_key
  ON public.transactions(workspace_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Registro financeiro único, validado e atômico.
CREATE OR REPLACE FUNCTION public.ai_create_transaction(
  p_workspace_id UUID,
  p_account_id UUID,
  p_category_id UUID,
  p_type transaction_type,
  p_amount NUMERIC,
  p_description TEXT,
  p_date TIMESTAMPTZ,
  p_idempotency_key TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_transaction_id UUID;
  v_modifier NUMERIC;
BEGIN
  IF NOT public.is_active_user() OR NOT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = p_workspace_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 999999999.99 THEN
    RAISE EXCEPTION 'Valor inválido';
  END IF;
  IF NULLIF(BTRIM(p_description), '') IS NULL THEN
    RAISE EXCEPTION 'Descrição obrigatória';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.accounts WHERE id = p_account_id AND workspace_id = p_workspace_id
  ) THEN
    RAISE EXCEPTION 'Conta inválida';
  END IF;

  INSERT INTO public.transactions (
    workspace_id, account_id, category_id, type, amount, description, date, status, idempotency_key
  ) VALUES (
    p_workspace_id, p_account_id, p_category_id, p_type, p_amount,
    BTRIM(p_description), COALESCE(p_date, NOW()), 'completed', p_idempotency_key
  )
  ON CONFLICT (workspace_id, idempotency_key) DO UPDATE
    SET idempotency_key = EXCLUDED.idempotency_key
  RETURNING id INTO v_transaction_id;

  IF NOT EXISTS (
    SELECT 1 FROM public.transactions
    WHERE id = v_transaction_id AND created_at >= transaction_timestamp()
  ) THEN
    RETURN v_transaction_id;
  END IF;

  v_modifier := CASE WHEN p_type = 'income' THEN p_amount ELSE -p_amount END;
  UPDATE public.accounts
  SET balance = balance + v_modifier
  WHERE id = p_account_id AND workspace_id = p_workspace_id;

  RETURN v_transaction_id;
END;
$$;

-- Retirada definitiva da funcionalidade descontinuada no banco já implantado.
DROP FUNCTION IF EXISTS public.admin_get_whatsapp();
DROP FUNCTION IF EXISTS public.admin_get_whatsapp_metrics();
DROP TABLE IF EXISTS public.whatsapp_events CASCADE;
DROP TABLE IF EXISTS public.whatsapp_messages CASCADE;
DROP TABLE IF EXISTS public.whatsapp_contacts CASCADE;
DROP TABLE IF EXISTS public.whatsapp_accounts CASCADE;

-- Funções administrativas só podem ser chamadas por sessões autenticadas e
-- continuam obrigadas a validar admin_check_access internamente.
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_check_access() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ai_create_transaction(UUID, UUID, UUID, transaction_type, NUMERIC, TEXT, TIMESTAMPTZ, TEXT) TO authenticated;

DO $$
DECLARE fn RECORD;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND (p.proname LIKE 'admin_%' OR p.proname = 'build_dashboard')
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', fn.signature);
  END LOOP;
END;
$$;
