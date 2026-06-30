-- 008_whatsapp.sql
-- Integrações com WhatsApp Cloud API

CREATE TABLE whatsapp_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    whatsapp_business_id TEXT,
    access_token TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_accounts_workspace ON whatsapp_accounts(workspace_id);
CREATE TRIGGER set_whatsapp_accounts_updated_at BEFORE UPDATE ON whatsapp_accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE whatsapp_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_contacts_workspace ON whatsapp_contacts(workspace_id);
CREATE INDEX idx_whatsapp_contacts_phone ON whatsapp_contacts(phone_number);
CREATE TRIGGER set_whatsapp_contacts_updated_at BEFORE UPDATE ON whatsapp_contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES whatsapp_accounts(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES whatsapp_contacts(id) ON DELETE SET NULL,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    content TEXT,
    status TEXT, -- delivered, read, failed
    whatsapp_message_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_messages_workspace ON whatsapp_messages(workspace_id);

CREATE TABLE whatsapp_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_events_workspace ON whatsapp_events(workspace_id);

ALTER TABLE whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access WA Accounts via workspace" ON whatsapp_accounts FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Access WA Contacts via workspace" ON whatsapp_contacts FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Access WA Messages via workspace" ON whatsapp_messages FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Access WA Events via workspace" ON whatsapp_events FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
