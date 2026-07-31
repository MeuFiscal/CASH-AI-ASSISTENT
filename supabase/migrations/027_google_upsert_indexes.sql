DROP INDEX IF EXISTS public.calendar_events_external_unique;
CREATE UNIQUE INDEX calendar_events_external_unique ON public.calendar_events(workspace_id, source, external_id);

DROP INDEX IF EXISTS public.documents_external_unique;
CREATE UNIQUE INDEX documents_external_unique ON public.documents(workspace_id, source, external_id);

NOTIFY pgrst, 'reload schema';
