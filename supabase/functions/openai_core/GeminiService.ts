/**
 * GeminiService — Motor de IA usando Google Gemini API REST (gratuito e ultrarrápido)
 */

interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args: Record<string, any> };
  functionResponse?: { name: string; response: Record<string, any> };
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured nos Secrets do Supabase.');
    }
    this.apiKey = apiKey;
  }

  async processMessage(
    systemPrompt: string,
    history: { role: string; content: string }[],
    tools: any[],
    model: string = 'gemini-flash-latest',
    temperature: number = 0.7
  ) {
    const startTime = Date.now();

    // Converter histórico do formato OpenAI para formato Gemini (filtrando mensagens vazias)
    const contents: GeminiContent[] = history
      .filter(msg => msg.content && msg.content.trim().length > 0)
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Se o histórico estiver vazio por algum motivo, garante ao menos a mensagem inicial
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Olá' }] });
    }

    const body: any = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature,
        maxOutputTokens: 2048,
      }
    };

    if (tools && tools.length > 0) {
      body.tools = [{ functionDeclarations: tools }];
    }

    try {
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('[Gemini Service] API Error:', response.status, errorBody);
        throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      const candidate = data.candidates?.[0];
      if (!candidate) {
        throw new Error('Gemini não retornou uma resposta válida.');
      }

      const rawContent = candidate.content; // Preserva o objeto completo (incluindo thoughtSignature)
      const parts = rawContent?.parts || [];
      
      // Extrair chamadas de função
      const functionCalls = parts
        .filter((p: GeminiPart) => p.functionCall)
        .map((p: GeminiPart, index: number) => ({
          id: `call_${index}`,
          type: 'function' as const,
          function: {
            name: p.functionCall!.name,
            arguments: JSON.stringify(p.functionCall!.args || {}),
          }
        }));

      // Extrair texto
      const textContent = parts
        .filter((p: GeminiPart) => p.text)
        .map((p: GeminiPart) => p.text)
        .join('');

      const usage = data.usageMetadata ? {
        prompt_tokens: data.usageMetadata.promptTokenCount || 0,
        completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
        total_tokens: data.usageMetadata.totalTokenCount || 0,
      } : undefined;

      console.log(`[Gemini Service] Model: ${model} | Latency: ${latency}ms | Tokens: ${usage?.total_tokens || 'N/A'}`);

      return {
        content: textContent || null,
        toolCalls: functionCalls.length > 0 ? functionCalls : undefined,
        rawContent, // Retorna o conteúdo bruto original para a 2ª chamada
        usage,
        latency,
      };
    } catch (error: any) {
      console.error('[Gemini Service] Erro na API Gemini:', error.message || error);
      throw error;
    }
  }

  /**
   * Processa a 2ª chamada enviando os resultados das ferramentas
   */
  async processWithToolResults(
    systemPrompt: string,
    history: { role: string; content: string }[],
    rawModelContent: any,
    toolResults: { name: string; result: string }[],
    model: string = 'gemini-flash-latest',
    temperature: number = 0.7
  ) {
    const startTime = Date.now();

    // Converter histórico base
    const contents: any[] = history
      .filter(msg => msg.content && msg.content.trim().length > 0)
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // 1. Anexa o conteúdo bruto gerado pelo Gemini (que contém o functionCall e o thoughtSignature)
    contents.push(rawModelContent);

    // 2. Anexa as respostas das ferramentas com o role "user" (padrão do Gemini REST API)
    const functionResponseParts = toolResults.map(tr => ({
      functionResponse: {
        name: tr.name,
        response: { result: tr.result }
      }
    }));

    contents.push({
      role: 'user',
      parts: functionResponseParts
    });

    const body: any = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature,
        maxOutputTokens: 2048,
        thinkingConfig: {
          thinkingBudget: 0,
        }
      }
    };

    try {
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('[Gemini Service] Erro na 2ª chamada:', response.status, errorBody);
        throw new Error(`Gemini API 2nd call error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      const candidate = data.candidates?.[0];
      const textContent = candidate?.content?.parts
        ?.filter((p: GeminiPart) => p.text)
        ?.map((p: GeminiPart) => p.text)
        ?.join('') || '';

      const usage = data.usageMetadata ? {
        prompt_tokens: data.usageMetadata.promptTokenCount || 0,
        completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
        total_tokens: data.usageMetadata.totalTokenCount || 0,
      } : undefined;

      console.log(`[Gemini Service] 2nd Call | Model: ${model} | Latency: ${latency}ms | Tokens: ${usage?.total_tokens || 'N/A'}`);

      return {
        content: textContent,
        toolCalls: undefined,
        usage,
        latency,
      };
    } catch (error: any) {
      console.error('[Gemini Service] Erro na 2ª chamada:', error.message || error);
      throw error;
    }
  }
}
