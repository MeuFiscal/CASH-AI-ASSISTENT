CREATE TABLE IF NOT EXISTS public.oauth_states (
  state TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.oauth_states FROM anon, authenticated;

ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS account_email TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS integration_tokens_integration_unique ON public.integration_tokens(integration_id);
DROP POLICY IF EXISTS "Access Integration Tokens via workspace" ON public.integration_tokens;
REVOKE ALL ON public.integration_tokens FROM anon, authenticated;

ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'cash_ai';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS external_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS calendar_events_external_unique ON public.calendar_events(workspace_id, source, external_id) WHERE external_id IS NOT NULL;

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'cash_ai';
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS external_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS documents_external_unique ON public.documents(workspace_id, source, external_id) WHERE external_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.google_mail_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  thread_id TEXT,
  subject TEXT NOT NULL DEFAULT '(Sem assunto)',
  sender TEXT,
  received_at TIMESTAMPTZ,
  snippet TEXT,
  is_unread BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, external_id)
);
ALTER TABLE public.google_mail_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access Google Mail via workspace" ON public.google_mail_items FOR SELECT
USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));
GRANT SELECT ON public.google_mail_items TO authenticated;

NOTIFY pgrst, 'reload schema';
