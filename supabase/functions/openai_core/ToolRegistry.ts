export const availableTools = [
  // Finanças
  { type: "function", function: { name: "criar_despesa", description: "Registra nova despesa no sistema.", parameters: { type: "object", properties: { description: { type: "string" }, amount: { type: "number" }, date: { type: "string" }, category_name: { type: "string", description: "Nome da categoria (ex: Alimentação)" }, account_name: { type: "string", description: "Opcional. Nome da conta (ex: Nubank)" } }, required: ["description", "amount"] } } },
  { type: "function", function: { name: "editar_despesa", description: "Edita uma despesa existente.", parameters: { type: "object", properties: { transaction_id: { type: "string" }, description: { type: "string" }, amount: { type: "number" } }, required: ["transaction_id"] } } },
  { type: "function", function: { name: "excluir_despesa", description: "Exclui uma despesa.", parameters: { type: "object", properties: { transaction_id: { type: "string" } }, required: ["transaction_id"] } } },
  { type: "function", function: { name: "criar_receita", description: "Registra nova receita.", parameters: { type: "object", properties: { description: { type: "string" }, amount: { type: "number" }, date: { type: "string" }, category_name: { type: "string", description: "Nome da categoria (ex: Salário)" }, account_name: { type: "string", description: "Opcional. Nome da conta (ex: Itaú)" } }, required: ["description", "amount"] } } },
  { type: "function", function: { name: "editar_receita", description: "Edita uma receita.", parameters: { type: "object", properties: { transaction_id: { type: "string" }, description: { type: "string" }, amount: { type: "number" } }, required: ["transaction_id"] } } },
  { type: "function", function: { name: "excluir_receita", description: "Exclui uma receita.", parameters: { type: "object", properties: { transaction_id: { type: "string" } }, required: ["transaction_id"] } } },
  { type: "function", function: { name: "consultar_saldo", description: "Consulta o saldo atual das contas bancárias.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "consultar_dashboard", description: "Traz um resumo financeiro e estatísticas para montar o dashboard.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "consultar_insights", description: "Gera ou consulta insights financeiros baseados no histórico real.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "gerar_relatorio", description: "Gera relatórios de balanço financeiro em um período específico.", parameters: { type: "object", properties: { start_date: { type: "string" }, end_date: { type: "string" } }, required: [] } } },

  // Agenda
  { type: "function", function: { name: "criar_evento", description: "Cria compromisso na agenda.", parameters: { type: "object", properties: { title: { type: "string" }, start_time: { type: "string", description: "Obrigatório formato ISO 8601 (ex: 2026-07-01T10:00:00-03:00). Considere UTC-3." }, end_time: { type: "string", description: "Obrigatório formato ISO 8601. Se o usuário não informar o término, pergunte a duração antes de agendar." }, description: { type: "string" }, location: { type: "string" } }, required: ["title", "start_time", "end_time"] } } },
  { type: "function", function: { name: "editar_evento", description: "Edita compromisso existente.", parameters: { type: "object", properties: { event_id: { type: "string" }, title: { type: "string" }, start_time: { type: "string", description: "Formato ISO 8601" } }, required: ["event_id"] } } },
  { type: "function", function: { name: "excluir_evento", description: "Exclui evento da agenda.", parameters: { type: "object", properties: { event_id: { type: "string" } }, required: ["event_id"] } } },
  { type: "function", function: { name: "consultar_agenda", description: "Visualiza os compromissos agendados num dia ou período.", parameters: { type: "object", properties: { date: { type: "string", description: "Formato YYYY-MM-DD" } }, required: [] } } },

  // Memória
  { type: "function", function: { name: "adicionar_memoria", description: "Adiciona um fato ou aprendizado importante ao Segundo Cérebro.", parameters: { type: "object", properties: { content: { type: "string" }, category: { type: "string" } }, required: ["content"] } } },
  { type: "function", function: { name: "editar_memoria", description: "Atualiza uma memória.", parameters: { type: "object", properties: { memory_id: { type: "string" }, content: { type: "string" } }, required: ["memory_id", "content"] } } },
  { type: "function", function: { name: "excluir_memoria", description: "Apaga uma memória.", parameters: { type: "object", properties: { memory_id: { type: "string" } }, required: ["memory_id"] } } },

  // Documentos
  { type: "function", function: { name: "pesquisar_documentos", description: "Pesquisa nos documentos do usuário baseados no workspace.", parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } } },

  // Integração
  { type: "function", function: { name: "enviar_whatsapp", description: "Prepara ou agenda envio de mensagem via WhatsApp.", parameters: { type: "object", properties: { to: { type: "string" }, text: { type: "string" } }, required: ["to", "text"] } } },
  { type: "function", function: { name: "responder_whatsapp", description: "Formata e dispara a resposta para um evento de recepção no WhatsApp.", parameters: { type: "object", properties: { message_id: { type: "string" }, text: { type: "string" } }, required: ["message_id", "text"] } } }
];

export function getTools() {
  return availableTools;
}
