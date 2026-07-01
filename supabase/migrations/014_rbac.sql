-- 014_rbac.sql
-- Controle de Acesso Global (Admin OS)

-- 1. Enum de Papéis Globais
CREATE TYPE global_role AS ENUM ('super_admin', 'admin', 'support', 'user');

-- 2. Tabela de Papéis dos Usuários
CREATE TABLE user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role global_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at
CREATE TRIGGER set_user_roles_updated_at 
BEFORE UPDATE ON user_roles 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. Inserção automática de 'user' para novos cadastros
CREATE OR REPLACE FUNCTION on_auth_user_created_set_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- OBS: Em um sistema já em produção, essa trigger deve ser acoplada à trigger existente de `on_auth_user_created`,
-- ou rodar separadamente. Vamos criar o trigger de forma independente.
CREATE TRIGGER on_auth_user_created_set_role_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE on_auth_user_created_set_role();

-- Inserir role 'user' para os usuários que já existem e não tem role
INSERT INTO user_roles (user_id, role)
SELECT id, 'user' FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles);

-- 4. Função de Bootstrap do Super Admin
-- Essa função só promove o chamador a super_admin se não houver NENHUM super_admin no sistema inteiro.
CREATE OR REPLACE FUNCTION bootstrap_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_super_admin_exists BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Checa se já existe algum super_admin
    SELECT EXISTS (
        SELECT 1 FROM user_roles WHERE role = 'super_admin'
    ) INTO v_super_admin_exists;

    IF v_super_admin_exists THEN
        -- O Bootstrap já ocorreu.
        RETURN FALSE;
    END IF;

    -- Ninguém é super_admin. Promover este usuário.
    INSERT INTO user_roles (user_id, role)
    VALUES (v_user_id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Função Utilitária para Checar se o chamador é Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Row Level Security (RLS)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Usuários podem ler o próprio papel
CREATE POLICY "Users can read own role"
ON user_roles FOR SELECT
USING (user_id = auth.uid());

-- Administradores podem ler todos os papéis
CREATE POLICY "Admins can read all roles"
ON user_roles FOR SELECT
USING (is_admin());

-- Apenas super_admins e admins podem atualizar papéis (se necessário restrições extras, adicionar logic no frontend)
CREATE POLICY "Admins can update roles"
ON user_roles FOR UPDATE
USING (is_admin());
