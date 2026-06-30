import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { AIEngine } from "./AIEngine.ts";
import { AIContextPayload } from "./types.ts";

serve(async (req) => {
  // Tratamento de CORS para requests do frontend
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const payload: AIContextPayload = await req.json();

    if (!payload.workspace_id || !payload.message) {
      throw new Error('workspace_id and message are required');
    }

    // Instancia o Engine passando o token do usuário chamador para segurança via RLS
    const engine = new AIEngine(authHeader);
    const result = await engine.run(payload);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('[OpenAI Core Edge Function] Fatal Error:', error.message);
    
    // Fallback estruturado em caso de erro
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      response: "Desculpe, meu núcleo de processamento está temporariamente indisponível. Tente novamente em instantes."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
