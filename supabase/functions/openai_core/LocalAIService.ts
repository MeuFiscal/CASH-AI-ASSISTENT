interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_call_id?: string;
  tool_calls?: LocalToolCall[];
}

interface LocalToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

interface LocalAIResponse {
  choices?: Array<{ message?: ChatMessage }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

/**
 * Cliente para um servidor de IA local compatível com a API OpenAI.
 * Funciona com Ollama (`ollama serve`) e servidores llama.cpp compatíveis.
 * Nenhuma chave de provedor externo é necessária.
 */
export class LocalAIService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = (Deno.env.get('LOCAL_AI_BASE_URL') || '').replace(/\/$/, '');
    if (!this.baseUrl) {
      throw new Error('LOCAL_AI_BASE_URL não configurada. Aponte para o servidor Ollama/llama.cpp privado.');
    }
  }

  async processMessage(
    systemPrompt: string,
    history: Array<{ role: string; content: string }>,
    tools: Array<{ functionDeclarations?: unknown[] }>,
    model = Deno.env.get('LOCAL_AI_MODEL') || 'qwen3:14b',
    temperature = 0.3,
  ) {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history
        .filter((item) => item.content?.trim())
        .map((item) => ({
          role: item.role === 'assistant' ? 'assistant' as const : 'user' as const,
          content: item.content,
        })),
    ];

    return this.request(messages, tools, model, temperature);
  }

  async processWithToolResults(
    systemPrompt: string,
    history: Array<{ role: string; content: string }>,
    rawModelContent: ChatMessage,
    toolResults: Array<{ name: string; result: string }>,
    model = Deno.env.get('LOCAL_AI_MODEL') || 'qwen3:14b',
    temperature = 0.3,
  ) {
    const calls = rawModelContent.tool_calls || [];
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((item) => ({
        role: item.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: item.content,
      })),
      rawModelContent,
      ...toolResults.map((result, index) => ({
        role: 'tool' as const,
        content: result.result,
        tool_call_id: calls[index]?.id || result.name,
      })),
    ];

    return this.request(messages, [], model, temperature);
  }

  private async request(
    messages: ChatMessage[],
    tools: Array<{ functionDeclarations?: unknown[] }>,
    model: string,
    temperature: number,
  ) {
    const startedAt = Date.now();
    const declarations = tools.flatMap((group) => group.functionDeclarations || []);
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: false,
        ...(declarations.length > 0
          ? { tools: declarations.map((fn) => ({ type: 'function', function: fn })) }
          : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`Servidor de IA local indisponível (${response.status}).`);
    }

    const data = await response.json() as LocalAIResponse;
    const message = data.choices?.[0]?.message;
    if (!message) throw new Error('O servidor de IA local retornou uma resposta inválida.');

    return {
      content: message.content || '',
      toolCalls: message.tool_calls || [],
      rawContent: message,
      usage: data.usage || {},
      latency: Date.now() - startedAt,
    };
  }
}
