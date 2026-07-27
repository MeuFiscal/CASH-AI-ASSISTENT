/**
 * GeminiService — Motor de IA usando Google Gemini 2.0 Flash (gratuito)
 * Substitui completamente o OpenAIService.ts
 */

interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args: Record<string, any> };
  functionResponse?: { name: string; response: { result: string } };
}

interface GeminiContent {
  role: 'user' | 'model' | 'function';
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
    model: string = 'gemini-2.0-flash',
    temperature: number = 0.7
  ) {
    const startTime = Date.now();

    // Converter histórico do formato OpenAI para formato Gemini
    const contents: GeminiContent[] = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Montar corpo da requisição
    const body: any = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature,
        maxOutputTokens: 4096,
      }
    };

    // Adicionar ferramentas se houver
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

      // Extrair resposta
      const candidate = data.candidates?.[0];
      if (!candidate) {
        throw new Error('Gemini não retornou uma resposta válida.');
      }

      const parts = candidate.content?.parts || [];
      
      // Verificar se há function calls
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

      // Uso de tokens (Gemini retorna em usageMetadata)
      const usage = data.usageMetadata ? {
        prompt_tokens: data.usageMetadata.promptTokenCount || 0,
        completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
        total_tokens: data.usageMetadata.totalTokenCount || 0,
      } : undefined;

      console.log(`[Gemini Service] Model: ${model} | Latency: ${latency}ms | Tokens: ${usage?.total_tokens || 'N/A'}`);

      return {
        content: textContent || null,
        toolCalls: functionCalls.length > 0 ? functionCalls : undefined,
        usage,
        latency,
      };
    } catch (error: any) {
      console.error('[Gemini Service] Erro na API Gemini:', error.message || error);
      throw error;
    }
  }

  /**
   * Processa mensagem com resultados de ferramentas (2ª chamada)
   * No Gemini, precisamos enviar o histórico completo incluindo as chamadas de função e respostas
   */
  async processWithToolResults(
    systemPrompt: string,
    history: { role: string; content: string }[],
    toolCalls: any[],
    toolResults: { name: string; result: string }[],
    model: string = 'gemini-2.0-flash',
    temperature: number = 0.7
  ) {
    const startTime = Date.now();

    // Converter histórico base
    const contents: any[] = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Adicionar as chamadas de função que o modelo fez
    const functionCallParts = toolCalls.map(tc => ({
      functionCall: {
        name: tc.function.name,
        args: JSON.parse(tc.function.arguments || '{}'),
      }
    }));
    contents.push({ role: 'model', parts: functionCallParts });

    // Adicionar as respostas das ferramentas
    const functionResponseParts = toolResults.map(tr => ({
      functionResponse: {
        name: tr.name,
        response: { result: tr.result }
      }
    }));
    contents.push({ role: 'function', parts: functionResponseParts });

    const body: any = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature,
        maxOutputTokens: 4096,
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
        throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
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
