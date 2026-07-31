# CASH AI ASSISTENT

Aplicação React/TypeScript com Supabase e um núcleo de IA executado em infraestrutura privada.

## Segurança e isolamento

- Cada registro de domínio pertence a um `workspace_id`.
- O Supabase aplica RLS e valida a sessão em todas as consultas do usuário.
- Um usuário não pode se associar diretamente ao workspace de terceiros.
- Funções administrativas exigem papel global ativo de administrador.
- O primeiro superadministrador deve ser provisionado manualmente por `service_role`; não existe bootstrap público.
- Histórico da IA é carregado pelo backend. O histórico enviado pelo navegador é ignorado.
- Operações financeiras da IA exigem confirmação e são executadas por uma função transacional.

## IA local

O núcleo usa um servidor compatível com `POST /v1/chat/completions`, como Ollama ou llama.cpp. Não há dependência de Gemini, OpenAI ou outra IA paga.

Variáveis da Edge Function:

```text
LOCAL_AI_BASE_URL=http://host.docker.internal:11434
LOCAL_AI_MODEL=qwen3:14b
```

O servidor de IA precisa estar acessível a partir do ambiente onde a Edge Function roda. Em produção, execute o modelo na mesma rede privada do backend; um Supabase hospedado não consegue acessar o `localhost` do computador do usuário.

Exemplo com Ollama:

```bash
ollama serve
ollama pull qwen3:14b
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Verificações:

```bash
npm run lint
npm run build
```

## Banco

As migrations ficam em `supabase/migrations`. A migration `024_security_local_ai_cleanup.sql` endurece o isolamento, remove estruturas descontinuadas e cria a operação financeira atômica.

Antes de aplicar em um banco com dados reais, faça backup e valide em staging. A migration de limpeza remove definitivamente as tabelas da funcionalidade descontinuada.
