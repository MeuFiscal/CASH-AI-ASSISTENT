-- 012_dashboard.sql
-- Dashboard (Views e RPCs)

CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- recommendation, warning, priority, summary
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_insights_workspace ON insights(workspace_id);
CREATE TRIGGER set_insights_updated_at BEFORE UPDATE ON insights FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access Insights via workspace" ON insights FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));


-- View Materializada não suporta realtime facilmente, então criaremos uma Função (RPC) 
-- que agrega os dados da Dashboard e devolve um JSON unificado.

CREATE OR REPLACE FUNCTION build_dashboard(p_workspace_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_finance JSONB;
    v_agenda JSONB;
    v_priorities JSONB;
    v_recent_messages JSONB;
    v_result JSONB;
BEGIN
    -- Valida acesso (garante que quem chama pertence ao workspace)
    IF NOT EXISTS (
        SELECT 1 FROM workspace_members 
        WHERE workspace_id = p_workspace_id AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;

    -- Agrega Finanças
    SELECT jsonb_build_object(
        'balance', COALESCE(SUM(balance), 0),
        'income_today', 0, -- Simplificado, idealmente uma query na tabela transactions
        'expense_today', 0
    ) INTO v_finance FROM accounts WHERE workspace_id = p_workspace_id;

    -- Agrega Agenda (Hoje)
    SELECT jsonb_agg(
        jsonb_build_object('id', id, 'title', title, 'time', start_time)
    ) INTO v_agenda FROM calendar_events 
    WHERE workspace_id = p_workspace_id AND start_time::date = CURRENT_DATE;

    -- Agrega Prioridades (Insights)
    SELECT jsonb_agg(
        jsonb_build_object('id', id, 'title', title, 'description', description)
    ) INTO v_priorities FROM insights 
    WHERE workspace_id = p_workspace_id AND is_read = false AND type = 'priority';

    -- Agrega Mensagens Recentes do WhatsApp
    SELECT jsonb_agg(
        jsonb_build_object('id', sub.id, 'content', sub.content, 'created_at', sub.created_at)
    ) INTO v_recent_messages 
    FROM (
        SELECT id, content, created_at 
        FROM whatsapp_messages 
        WHERE workspace_id = p_workspace_id 
        ORDER BY created_at DESC LIMIT 5
    ) sub;

    v_result := jsonb_build_object(
        'finances', COALESCE(v_finance, '{}'::jsonb),
        'agenda', COALESCE(v_agenda, '[]'::jsonb),
        'priorities', COALESCE(v_priorities, '[]'::jsonb),
        'whatsapp', COALESCE(v_recent_messages, '[]'::jsonb)
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Storage Buckets Configuration (Nativo do Supabase)
-- Inserir os buckets se o schema de storage existir e houver permissão,
-- porém normalmente recomenda-se fazer via CLI/Dashboard.
-- Apenas como blueprint:
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('documents', 'documents', false),
('receipts', 'receipts', false),
('contracts', 'contracts', false),
('imports', 'imports', false),
('exports', 'exports', false),
('temp', 'temp', false)
ON CONFLICT (id) DO NOTHING;
