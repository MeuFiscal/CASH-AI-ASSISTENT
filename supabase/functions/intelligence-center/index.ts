import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "https://esm.sh/openai@4.24.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    // Autenticação
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Inicializar OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // Preparar as chamadas para o banco de dados via admin client (Service Role) 
    // porque o usuário pode não ter RLS pra ver o sistema inteiro (apesar de ser admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Ferramentas disponíveis para a IA
    const tools = [
      {
        type: "function",
        function: {
          name: "get_financial_summary",
          description: "Obtém resumo financeiro atual: MRR, ARR, LTV, CAC, ARPU, Churn.",
        },
      },
      {
        type: "function",
        function: {
          name: "get_kpis",
          description: "Obtém número de usuários totais e hoje, workspaces, receita, tokens de IA gastos hoje, e mensagens de WhatsApp disparadas hoje.",
        },
      },
      {
        type: "function",
        function: {
          name: "get_top_workspaces",
          description: "Obtém o ranking dos 10 maiores clientes/workspaces por receita e uso de tokens.",
        }
      }
    ]

    const messages = [
      { role: 'system', content: `Você é o Centro de Inteligência do Admin OS (CASH AI). 
Você tem acesso ao banco de dados em tempo real através de funções.
Responda de forma concisa, executiva e direta ao ponto.
Seja educado e forneça insights interessantes se notar algum dado peculiar.
Responda SEMPRE em Português do Brasil.` },
      { role: 'user', content: query }
    ]

    // 1ª Chamada para a OpenAI (para descobrir se ela quer usar alguma ferramenta)
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      tools: tools as any,
      tool_choice: "auto",
    })

    const responseMessage = response.choices[0].message;

    // Se a IA decidiu chamar alguma função do banco
    if (responseMessage.tool_calls) {
      messages.push(responseMessage as any);

      for (const toolCall of responseMessage.tool_calls) {
        let functionResult = "";
        
        try {
          if (toolCall.function.name === 'get_financial_summary') {
            const { data } = await supabaseAdmin.rpc('admin_get_financial_summary');
            functionResult = JSON.stringify(data);
          } 
          else if (toolCall.function.name === 'get_kpis') {
            const { data } = await supabaseAdmin.rpc('admin_get_kpis_v2');
            functionResult = JSON.stringify(data);
          }
          else if (toolCall.function.name === 'get_top_workspaces') {
            const { data } = await supabaseAdmin.rpc('admin_get_top_workspaces');
            functionResult = JSON.stringify(data);
          }
        } catch (e) {
          functionResult = JSON.stringify({ error: "Falha ao buscar dados" });
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: toolCall.function.name,
          content: functionResult,
        } as any);
      }

      // 2ª Chamada para a OpenAI com os dados do banco para formular a resposta final
      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages as any,
      });

      return new Response(JSON.stringify({ reply: secondResponse.choices[0].message.content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Se a IA não precisou de dados do banco e respondeu direto
    return new Response(JSON.stringify({ reply: responseMessage.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
