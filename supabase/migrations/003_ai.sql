-- 003_ai.sql
-- Inteligência Artificial do Workspace

-- 1. Tabela: workspace_ai (Configurações Centrais da IA)
CREATE TABLE workspace_ai (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID UNIQUE NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    personality TEXT DEFAULT 'Assistente Executivo',
    language TEXT DEFAULT 'pt-BR',
    tone TEXT DEFAULT 'profissional',
    model TEXT DEFAULT 'gpt-4o',
    memory_enabled BOOLEAN DEFAULT true,
    daily_summary_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_workspace_ai_updated_at BEFORE UPDATE ON workspace_ai FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. Tabela: workspace_memory (Lembranças de Longo Prazo)
CREATE TABLE workspace_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    fact TEXT NOT NULL,
    category TEXT, -- Ex: 'finances', 'personal', 'work'
    importance INTEGER DEFAULT 1, -- 1 a 5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workspace_memory_workspace ON workspace_memory(workspace_id);
CREATE TRIGGER set_workspace_memory_updated_at BEFORE UPDATE ON workspace_memory FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. Tabela: workspace_learnings (Aprendizados deduzidos pela IA ao longo do tempo)
CREATE TABLE workspace_learnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    learning TEXT NOT NULL,
    confidence_score NUMERIC(4,2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workspace_learnings_workspace ON workspace_learnings(workspace_id);
CREATE TRIGGER set_workspace_learnings_updated_at BEFORE UPDATE ON workspace_learnings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. Tabela: workspace_preferences (Preferências Explícitas)
CREATE TABLE workspace_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, key)
);

CREATE TRIGGER set_workspace_preferences_updated_at BEFORE UPDATE ON workspace_preferences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS
ALTER TABLE workspace_ai ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access AI config via workspace" ON workspace_ai FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Access Memory via workspace" ON workspace_memory FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Access Learnings via workspace" ON workspace_learnings FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Access Preferences via workspace" ON workspace_preferences FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
