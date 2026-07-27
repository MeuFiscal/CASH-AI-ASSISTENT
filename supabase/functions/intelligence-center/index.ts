import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

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

    // Chave do Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY não configurada.');
    }

    // Admin client para acessar dados sem RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Ferramentas disponíveis para a IA (formato Gemini)
    const tools = [{
      functionDeclarations: [
        {
          name: "get_financial_summary",
          description: "Obtém resumo financeiro atual: MRR, ARR, LTV, CAC, ARPU, Churn.",
          parameters: { type: "object", properties: {} }
        },
        {
          name: "get_kpis",
          description: "Obtém número de usuários totais e hoje, workspaces, receita, tokens de IA gastos hoje, e mensagens de WhatsApp disparadas hoje.",
          parameters: { type: "object", properties: {} }
        },
        {
          name: "get_top_workspaces",
          description: "Obtém o ranking dos 10 maiores clientes/workspaces por receita e uso de tokens.",
          parameters: { type: "object", properties: {} }
        }
      ]
    }];

    // 1ª Chamada para o Gemini
    const firstResponse = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: query }] }],
          systemInstruction: {
            parts: [{ text: `Você é o Centro de Inteligência do Admin OS (CASH AI). 
Você tem acesso ao banco de dados em tempo real através de funções.
Responda de forma concisa, executiva e direta ao ponto.
Seja educado e forneça insights interessantes se notar algum dado peculiar.
Responda SEMPRE em Português do Brasil.` }]
          },
          tools,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      }
    );

    if (!firstResponse.ok) {
      const errText = await firstResponse.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const firstData = await firstResponse.json();
    const candidate = firstData.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    // Verificar se o Gemini quer chamar funções
    const functionCalls = parts.filter((p: any) => p.functionCall);

    if (functionCalls.length > 0) {
      // Executar as funções solicitadas
      const functionResponseParts: any[] = [];

      for (const part of functionCalls) {
        const fnName = part.functionCall.name;
        let functionResult = "";

        try {
          if (fnName === 'get_financial_summary') {
            const { data } = await supabaseAdmin.rpc('admin_get_financial_summary');
            functionResult = JSON.stringify(data);
          } 
          else if (fnName === 'get_kpis') {
            const { data } = await supabaseAdmin.rpc('admin_get_kpis_v2');
            functionResult = JSON.stringify(data);
          }
          else if (fnName === 'get_top_workspaces') {
            const { data } = await supabaseAdmin.rpc('admin_get_top_workspaces');
            functionResult = JSON.stringify(data);
          }
        } catch (e) {
          functionResult = JSON.stringify({ error: "Falha ao buscar dados" });
        }

        functionResponseParts.push({
          functionResponse: {
            name: fnName,
            response: { result: functionResult }
          }
        });
      }

      // 2ª Chamada para o Gemini com os resultados das funções
      const secondResponse = await fetch(
        `${GEMINI_BASE_URL}/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: query }] },
              { role: 'model', parts: functionCalls.map((p: any) => ({ functionCall: p.functionCall })) },
              { role: 'function', parts: functionResponseParts }
            ],
            systemInstruction: {
              parts: [{ text: `Você é o Centro de Inteligência do Admin OS (CASH AI). 
Responda de forma concisa, executiva e direta ao ponto.
Seja educado e forneça insights interessantes se notar algum dado peculiar.
Responda SEMPRE em Português do Brasil.` }]
            },
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
          })
        }
      );

      if (!secondResponse.ok) {
        const errText = await secondResponse.text();
        throw new Error(`Gemini 2nd call error: ${errText}`);
      }

      const secondData = await secondResponse.json();
      const reply = secondData.candidates?.[0]?.content?.parts
        ?.filter((p: any) => p.text)
        ?.map((p: any) => p.text)
        ?.join('') || 'Sem resposta.';

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Se o Gemini não precisou de dados e respondeu direto
    const directReply = parts
      .filter((p: any) => p.text)
      .map((p: any) => p.text)
      .join('') || 'Sem resposta.';

    return new Response(JSON.stringify({ reply: directReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
