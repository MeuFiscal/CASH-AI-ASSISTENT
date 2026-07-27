import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { AIContextPayload } from './types.ts';
import { buildSystemPrompt } from './PromptManager.ts';
import { getTools } from './ToolRegistry.ts';
import { GeminiService } from './GeminiService.ts';
import { ToolExecutor } from './ToolExecutor.ts';

export class AIEngine {
  private supabase;

  constructor(authHeader: string) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    // Criamos o client usando o token do usuário para respeitar o RLS
    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
  }

  async run(payload: AIContextPayload) {
    const { workspace_id, message, history = [], source = 'chat', user_id, channel = 'web', contact_id } = payload;
    let { conversation_id } = payload;

    // 1. Buscar Contexto do Workspace
    const { data: wsData, error: wsError } = await this.supabase
      .from('workspaces')
      .select('id, name')
      .eq('id', workspace_id)
      .single();

    if (wsError) {
      console.error('[AIEngine] Erro ao buscar workspace:', wsError);
      throw new Error('Workspace não encontrado ou acesso negado.');
    }

    let conversationHistory = [...history];

    if (channel === 'whatsapp' && contact_id) {
      // Para WhatsApp: Busca o histórico diretamente da whatsapp_messages
      const { data: waHistory } = await this.supabase
        .from('whatsapp_messages')
        .select('direction, content')
        .eq('contact_id', contact_id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (waHistory) {
        const sorted = waHistory.reverse();
        conversationHistory = sorted.map(m => ({
          role: m.direction === 'inbound' ? 'user' : 'assistant',
          content: m.content || ''
        }));
      }
    } else {
      // Lógica do Web Chat (cria conversa e salva msg do usuário)
      if (!conversation_id) {
        const { data: conv } = await this.supabase
          .from('conversations')
          .insert({ workspace_id, title: message.substring(0, 30) + '...' })
          .select('id')
          .single();
        if (conv) conversation_id = conv.id;
      }

      if (conversation_id) {
        await this.supabase.from('messages').insert({
          conversation_id,
          workspace_id,
          sender_id: user_id,
          source,
          role: 'user',
          content: message
        });
      }
      
      // Anexa a nova mensagem do usuário no histórico que veio no payload
      conversationHistory.push({ role: 'user', content: message });
    }

    // 2. Buscar Configurações da IA
    const { data: aiData } = await this.supabase
      .from('workspace_ai')
      .select('base_prompt, temperature, model')
      .eq('workspace_id', workspace_id)
      .maybeSingle();

    // 3. Buscar Memórias e Aprendizados
    const { data: memories } = await this.supabase
      .from('workspace_memory')
      .select('id, content')
      .eq('workspace_id', workspace_id);
      
    const { data: learnings } = await this.supabase
      .from('workspace_learnings')
      .select('id, learning')
      .eq('workspace_id', workspace_id);

    const { data: prefs } = await this.supabase
      .from('workspace_preferences')
      .select('value')
      .eq('workspace_id', workspace_id)
      .eq('key', 'ai_advanced')
      .maybeSingle();

    // 4. Construir o Prompt Central
    let systemPrompt = buildSystemPrompt(
      wsData,
      memories || [],
      aiData?.base_prompt || '',
      channel
    );
    
    // Injetar Aprendizados Contínuos
    if (learnings && learnings.length > 0) {
      systemPrompt += `\n[APRENDIZADOS CONTÍNUOS]\n`;
      learnings.forEach(l => {
        systemPrompt += `- ${l.learning}\n`;
      });
    }

    // Injetar Preferências Avançadas
    if (prefs?.value) {
      const advanced = prefs.value as any;
      if (advanced.shortAnswers) {
        systemPrompt += `\n[INSTRUÇÃO IMPORTANTE: Forneça respostas curtas, diretas e objetivas. Evite explicações longas.]\n`;
      }
      if (advanced.useEmojis === false) {
        systemPrompt += `\n[INSTRUÇÃO IMPORTANTE: Não utilize emojis em suas respostas.]\n`;
      } else {
        systemPrompt += `\n[INSTRUÇÃO IMPORTANTE: Utilize emojis para tornar a comunicação amigável.]\n`;
      }
    }
    
    if (aiData?.tone) {
      systemPrompt += `\n[TOM DE VOZ: ${aiData.tone}]\n`;
    }
    if (aiData?.personality) {
      systemPrompt += `\n[ESPECIALIZAÇÃO: ${aiData.personality}]\n`;
    }

    // Regra anti-alucinação crítica
    systemPrompt += `\n[REGRA DE OURO - INTEGRIDADE DE DADOS]\nVOCÊ É PROIBIDO DE INVENTAR, SIMULAR OU ALUCINAR QUALQUER DADO FINANCEIRO OU COMPROMISSO. Se um usuário pedir um relatório ou saldo e a ferramenta retornar vazio, você DEVE dizer que não há dados reais cadastrados. NUNCA use dados de exemplo (ex: "Salário R$ 5.000"). Use ESTRITAMENTE os dados retornados pelas ferramentas.\n`;

    // 5. Preparar Ferramentas
    const tools = getTools();

    // 6. Processar no Gemini
    const geminiService = new GeminiService();
    
    // Mapear modelo do usuário para Gemini (ignorar nomes antigos de GPT)
    const modelMap: Record<string, string> = {
      'gpt-4o': 'gemini-2.0-flash',
      'gpt-4-turbo': 'gemini-2.0-flash',
      'gpt-4-turbo-preview': 'gemini-2.0-flash',
      'gpt-3.5-turbo': 'gemini-2.0-flash-lite',
    };
    const requestedModel = aiData?.model || 'gemini-2.0-flash';
    const model = modelMap[requestedModel] || requestedModel;
    const temperature = aiData?.temperature !== undefined ? aiData.temperature : 0.7;

    let aiResponse = await geminiService.processMessage(
      systemPrompt,
      conversationHistory,
      tools,
      model,
      temperature
    );
    
    // ReAct Loop: Executar ferramentas se a IA solicitar
    if (aiResponse.toolCalls && aiResponse.toolCalls.length > 0) {
      const executor = new ToolExecutor(this.supabase);
      const toolResults: { name: string; result: string }[] = [];
      
      for (const call of aiResponse.toolCalls) {
        if (call.type === 'function') {
          const fn = call.function;
          const args = JSON.parse(fn.arguments || '{}');
          
          const result = await executor.executeTool(fn.name, args, workspace_id);
          toolResults.push({ name: fn.name, result });
        }
      }
      
      // Chama o Gemini novamente com os resultados das ferramentas
      aiResponse = await geminiService.processWithToolResults(
        systemPrompt,
        conversationHistory,
        aiResponse.toolCalls,
        toolResults,
        model,
        temperature
      );
    }
    
    // Gravar Mensagem da IA com Metadados
    if (channel !== 'whatsapp' && conversation_id) {
      const estimatedCost = 0; // Gemini Flash é gratuito!
      await this.supabase.from('messages').insert({
        conversation_id,
        workspace_id,
        sender_id: null,
        source,
        role: 'assistant',
        content: aiResponse.content || '',
        metadata: {
          model,
          tokens: aiResponse.usage?.total_tokens,
          latency: aiResponse.latency,
          cost: estimatedCost,
          tool_calls: aiResponse.toolCalls
        }
      });
    }

    return {
      success: true,
      conversation_id,
      response: aiResponse.content,
      toolCalls: aiResponse.toolCalls,
      usage: aiResponse.usage,
      latency: aiResponse.latency,
    };
  }
}
