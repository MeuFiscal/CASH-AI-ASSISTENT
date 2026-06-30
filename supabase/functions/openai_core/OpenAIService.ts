import OpenAI from 'npm:openai@^4.0.0';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configurada nos Secrets do Supabase.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async processMessage(
    systemPrompt: string,
    history: { role: string; content: string }[],
    tools: any[],
    model: string = 'gpt-4o',
    temperature: number = 0.7
  ) {
    const startTime = Date.now();

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history
    ];

    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: messages as any,
        tools: tools.length > 0 ? tools : undefined,
        temperature,
      });

      const latency = Date.now() - startTime;
      const usage = response.usage;
      const message = response.choices[0].message;

      // Observabilidade
      console.log(`[OpenAI Core] Model: ${model} | Latency: ${latency}ms | Tokens: ${usage?.total_tokens}`);

      return {
        content: message.content,
        toolCalls: message.tool_calls,
        usage,
        latency,
      };
    } catch (error: any) {
      console.error('[OpenAI Core] Erro na API OpenAI:', error.message || error);
      throw error;
    }
  }
}
