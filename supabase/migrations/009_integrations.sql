-- 009_integrations.sql
-- Integrações de Terceiros (Google, Outlook, Asaas, etc)

CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- ex: 'google', 'outlook', 'asaas'
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, provider)
);

CREATE INDEX idx_integrations_workspace ON integrations(workspace_id);
CREATE TRIGGER set_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE integration_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_integration_tokens_integration ON integration_tokens(integration_id);
CREATE TRIGGER set_integration_tokens_updated_at BEFORE UPDATE ON integration_tokens FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE integration_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- success, failure
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_integration_sync_logs_integration ON integration_sync_logs(integration_id);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access Integrations via workspace" ON integrations FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Access Integration Tokens via workspace" ON integration_tokens FOR ALL USING (integration_id IN (SELECT id FROM integrations WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));
CREATE POLICY "Access Integration Sync Logs via workspace" ON integration_sync_logs FOR ALL USING (integration_id IN (SELECT id FROM integrations WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));
