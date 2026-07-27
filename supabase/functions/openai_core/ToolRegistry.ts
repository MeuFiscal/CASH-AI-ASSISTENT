/**
 * ToolRegistry — Ferramentas da IA no formato Google Gemini (functionDeclarations)
 * 
 * Migrado do formato OpenAI para o formato Gemini.
 * A estrutura do Gemini é mais simples: não precisa do wrapper "type: function".
 */

export const availableTools = [
  // ── Finanças ──
  {
    name: "criar_despesa",
    description: "Registra nova despesa no sistema.",
    parameters: {
      type: "object",
      properties: {
        description: { type: "string", description: "Descrição da despesa" },
        amount: { type: "number", description: "Valor da despesa" },
        date: { type: "string", description: "Data no formato ISO 8601" },
        category_name: { type: "string", description: "Nome da categoria (ex: Alimentação)" },
        account_name: { type: "string", description: "Nome da conta (ex: Nubank)" }
      },
      required: ["description", "amount"]
    }
  },
  {
    name: "editar_despesa",
    description: "Edita uma despesa existente.",
    parameters: {
      type: "object",
      properties: {
        transaction_id: { type: "string", description: "ID da transação" },
        description: { type: "string", description: "Nova descrição" },
        amount: { type: "number", description: "Novo valor" }
      },
      required: ["transaction_id"]
    }
  },
  {
    name: "excluir_despesa",
    description: "Exclui uma despesa.",
    parameters: {
      type: "object",
      properties: {
        transaction_id: { type: "string", description: "ID da transação" }
      },
      required: ["transaction_id"]
    }
  },
  {
    name: "criar_receita",
    description: "Registra nova receita.",
    parameters: {
      type: "object",
      properties: {
        description: { type: "string", description: "Descrição da receita" },
        amount: { type: "number", description: "Valor da receita" },
        date: { type: "string", description: "Data no formato ISO 8601" },
        category_name: { type: "string", description: "Nome da categoria (ex: Salário)" },
        account_name: { type: "string", description: "Nome da conta (ex: Itaú)" }
      },
      required: ["description", "amount"]
    }
  },
  {
    name: "editar_receita",
    description: "Edita uma receita.",
    parameters: {
      type: "object",
      properties: {
        transaction_id: { type: "string", description: "ID da transação" },
        description: { type: "string", description: "Nova descrição" },
        amount: { type: "number", description: "Novo valor" }
      },
      required: ["transaction_id"]
    }
  },
  {
    name: "excluir_receita",
    description: "Exclui uma receita.",
    parameters: {
      type: "object",
      properties: {
        transaction_id: { type: "string", description: "ID da transação" }
      },
      required: ["transaction_id"]
    }
  },
  {
    name: "consultar_saldo",
    description: "Consulta o saldo atual das contas bancárias.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "consultar_dashboard",
    description: "Traz um resumo financeiro e estatísticas para montar o dashboard.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "consultar_insights",
    description: "Gera ou consulta insights financeiros baseados no histórico real.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "gerar_relatorio",
    description: "Gera relatórios de balanço financeiro em um período específico.",
    parameters: {
      type: "object",
      properties: {
        start_date: { type: "string", description: "Data de início no formato YYYY-MM-DD" },
        end_date: { type: "string", description: "Data de fim no formato YYYY-MM-DD" }
      }
    }
  },

  // ── Agenda ──
  {
    name: "criar_evento",
    description: "Cria compromisso na agenda.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Título do evento" },
        start_time: { type: "string", description: "Obrigatório formato ISO 8601 (ex: 2026-07-01T10:00:00-03:00). Considere UTC-3." },
        end_time: { type: "string", description: "Obrigatório formato ISO 8601. Se o usuário não informar o término, pergunte a duração antes de agendar." },
        description: { type: "string", description: "Descrição do evento" },
        location: { type: "string", description: "Local do evento" }
      },
      required: ["title", "start_time", "end_time"]
    }
  },
  {
    name: "editar_evento",
    description: "Edita compromisso existente.",
    parameters: {
      type: "object",
      properties: {
        event_id: { type: "string", description: "ID do evento" },
        title: { type: "string", description: "Novo título" },
        start_time: { type: "string", description: "Novo horário (formato ISO 8601)" }
      },
      required: ["event_id"]
    }
  },
  {
    name: "excluir_evento",
    description: "Exclui evento da agenda.",
    parameters: {
      type: "object",
      properties: {
        event_id: { type: "string", description: "ID do evento" }
      },
      required: ["event_id"]
    }
  },
  {
    name: "consultar_agenda",
    description: "Visualiza os compromissos agendados num dia ou período.",
    parameters: {
      type: "object",
      properties: {
        date: { type: "string", description: "Formato YYYY-MM-DD" }
      }
    }
  },

  // ── Memória ──
  {
    name: "adicionar_memoria",
    description: "Adiciona um fato ou aprendizado importante ao Segundo Cérebro.",
    parameters: {
      type: "object",
      properties: {
        content: { type: "string", description: "Conteúdo da memória" },
        category: { type: "string", description: "Categoria da memória" }
      },
      required: ["content"]
    }
  },
  {
    name: "editar_memoria",
    description: "Atualiza uma memória.",
    parameters: {
      type: "object",
      properties: {
        memory_id: { type: "string", description: "ID da memória" },
        content: { type: "string", description: "Novo conteúdo" }
      },
      required: ["memory_id", "content"]
    }
  },
  {
    name: "excluir_memoria",
    description: "Apaga uma memória.",
    parameters: {
      type: "object",
      properties: {
        memory_id: { type: "string", description: "ID da memória" }
      },
      required: ["memory_id"]
    }
  },

  // ── Documentos ──
  {
    name: "pesquisar_documentos",
    description: "Pesquisa nos documentos do usuário baseados no workspace.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Texto de busca" }
      },
      required: ["query"]
    }
  },

  // ── Integração ──
  {
    name: "enviar_whatsapp",
    description: "Prepara ou agenda envio de mensagem via WhatsApp.",
    parameters: {
      type: "object",
      properties: {
        to: { type: "string", description: "Número do destinatário" },
        text: { type: "string", description: "Texto da mensagem" }
      },
      required: ["to", "text"]
    }
  },
  {
    name: "responder_whatsapp",
    description: "Formata e dispara a resposta para um evento de recepção no WhatsApp.",
    parameters: {
      type: "object",
      properties: {
        message_id: { type: "string", description: "ID da mensagem original" },
        text: { type: "string", description: "Texto da resposta" }
      },
      required: ["message_id", "text"]
    }
  }
];

export function getTools() {
  return availableTools;
}
