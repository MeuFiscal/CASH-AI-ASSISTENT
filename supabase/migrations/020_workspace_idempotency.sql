-- 020_workspace_idempotency.sql
-- Saneamento, restrição UNIQUE e Trigger de Bootstrap Automático

-- 1. Saneamento: Encontrar e resolver workspaces duplicados
DO $$
DECLARE
    v_user RECORD;
    v_oldest_workspace UUID;
    v_dup_workspace UUID;
BEGIN
    -- Para cada usuário que possui mais de 1 workspace do qual é dono
    FOR v_user IN (
        SELECT owner_user_id
        FROM public.workspaces
        GROUP BY owner_user_id
        HAVING COUNT(*) > 1
    ) LOOP
        -- Pegar o workspace mais antigo (o principal)
        SELECT id INTO v_oldest_workspace
        FROM public.workspaces
        WHERE owner_user_id = v_user.owner_user_id
        ORDER BY created_at ASC
        LIMIT 1;

        -- Loop nos workspaces duplicados mais recentes
        FOR v_dup_workspace IN (
            SELECT id
            FROM public.workspaces
            WHERE owner_user_id = v_user.owner_user_id
              AND id != v_oldest_workspace
        ) LOOP
            
            -- Migrar tabelas 1-para-N (Exemplos principais para não perder dados)
            UPDATE public.conversations SET workspace_id = v_oldest_workspace WHERE workspace_id = v_dup_workspace;
            UPDATE public.accounts SET workspace_id = v_oldest_workspace WHERE workspace_id = v_dup_workspace;
            UPDATE public.transactions SET workspace_id = v_oldest_workspace WHERE workspace_id = v_dup_workspace;
            UPDATE public.whatsapp_contacts SET workspace_id = v_oldest_workspace WHERE workspace_id = v_dup_workspace;
            UPDATE public.documents SET workspace_id = v_oldest_workspace WHERE workspace_id = v_dup_workspace;
            
            -- Para tabelas 1-para-1 ou relacionamentos que podem conflitar, o ON DELETE CASCADE cuidará.
            -- Deleta o workspace duplicado (isso vai dar cascade em assinaturas, workspace_ai e membros dele).
            DELETE FROM public.workspaces WHERE id = v_dup_workspace;
            
        END LOOP;
    END LOOP;
END;
$$;

-- 2. Adicionar a restrição no Banco de Dados (Idempotência estrutural)
ALTER TABLE public.workspaces ADD CONSTRAINT workspaces_owner_user_id_key UNIQUE (owner_user_id);

-- 3. Função Definitiva de Bootstrap no Backend (Idempotente)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_workspace_id UUID;
    v_plan_id UUID;
BEGIN
    -- 3.1 Verifica se já possui workspace (Idempotência)
    SELECT id INTO v_workspace_id 
    FROM public.workspaces 
    WHERE owner_user_id = NEW.id 
    LIMIT 1;

    IF v_workspace_id IS NULL THEN
        -- 3.2 Cria o Workspace
        INSERT INTO public.workspaces (name, slug, owner_user_id)
        VALUES (
            COALESCE(NEW.raw_user_meta_data->>'name', 'Meu Workspace'),
            'ws-' || substr(NEW.id::text, 1, 8) || '-' || substr(md5(random()::text), 1, 6),
            NEW.id
        ) RETURNING id INTO v_workspace_id;

        -- 3.3 Adiciona o criador como membro owner
        INSERT INTO public.workspace_members (workspace_id, user_id, role)
        VALUES (v_workspace_id, NEW.id, 'owner');

        -- 3.4 Cria Configuração Inicial de IA
        INSERT INTO public.workspace_ai (workspace_id)
        VALUES (v_workspace_id);

        -- 3.5 Atribui plano gratuito ou básico inicial se houver
        SELECT id INTO v_plan_id FROM public.plans LIMIT 1;
        
        IF v_plan_id IS NOT NULL THEN
            INSERT INTO public.subscriptions (workspace_id, plan_id, status)
            VALUES (v_workspace_id, v_plan_id, 'TRIALING');
        END IF;

        -- Se tiver telefone no meta_data, pode inserir no whatsapp_contacts opcionalmente...
        -- (Mantendo simples conforme arquitetura backend)
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar a Trigger no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
