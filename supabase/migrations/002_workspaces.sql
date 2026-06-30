-- 002_workspaces.sql
-- Workspaces e Membros (A fundação do Segundo Cérebro)

-- 1. Tabela: workspaces
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type workspace_type NOT NULL DEFAULT 'personal',
    owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    locale TEXT DEFAULT 'pt-BR',
    status TEXT DEFAULT 'active',
    plan TEXT DEFAULT 'premium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_user_id);
CREATE TRIGGER set_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. Tabela: workspace_members
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id) -- Previne membros duplicados
);

CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE TRIGGER set_workspace_members_updated_at BEFORE UPDATE ON workspace_members FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. Row Level Security (RLS) & Policies

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas os workspaces dos quais são membros
CREATE POLICY "Select workspaces based on membership"
ON workspaces FOR SELECT
USING (id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Donos podem ver seus próprios workspaces (importante logo após a criação!)
CREATE POLICY "Select workspaces based on ownership"
ON workspaces FOR SELECT
USING (owner_user_id = auth.uid());

-- Apenas os donos podem alterar o workspace
CREATE POLICY "Update workspaces if owner"
ON workspaces FOR UPDATE
USING (owner_user_id = auth.uid());

-- Permitir que os usuários criem seus próprios workspaces
CREATE POLICY "Insert own workspace"
ON workspaces FOR INSERT
WITH CHECK (owner_user_id = auth.uid());


ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias filiações
CREATE POLICY "Select members in same workspace"
ON workspace_members FOR SELECT
USING (user_id = auth.uid());

-- Permitir que os usuários criem seu próprio workspace_members
CREATE POLICY "Insert own workspace_members"
ON workspace_members FOR INSERT
WITH CHECK (user_id = auth.uid());
