import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const payload = await req.json();
    const { phone, message, workspace_id, contact_id, account_id } = payload;

    if (!phone || !message || !workspace_id) {
      throw new Error('phone, message e workspace_id são obrigatórios');
    }

    const metaToken = Deno.env.get('META_BEARER_TOKEN');
    // Using the fixed phone number ID requested by the user
    const phoneNumberId = Deno.env.get('PHONE_NUMBER_ID') || '1112528585286497';
    
    if (!metaToken) {
      throw new Error('META_BEARER_TOKEN não configurado');
    }

    const metaUrl = `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`;

    const metaPayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phone,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    const startTime = Date.now();

    // Basic retry simple
    let attempt = 0;
    let success = false;
    let metaResponseData: any = null;
    let lastError = null;

    while (attempt < 2 && !success) {
      try {
        attempt++;
        console.log(`[send_whatsapp_message] Tentativa ${attempt} para ${phone}`);
        const metaRes = await fetch(metaUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${metaToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metaPayload),
        });

        const data = await metaRes.json();
        
        if (!metaRes.ok) {
          throw new Error(data.error?.message || 'Erro desconhecido na Meta API');
        }

        metaResponseData = data;
        success = true;
      } catch (err) {
        lastError = err;
        if (attempt < 2) {
          await new Promise(res => setTimeout(res, 1000));
        }
      }
    }

    const latency = Date.now() - startTime;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const graphMessageId = metaResponseData?.messages?.[0]?.id || null;

      await supabase.from('whatsapp_messages').insert({
        workspace_id,
        contact_id,
        account_id,
        direction: 'outbound',
        content: message,
        status: success ? 'sent' : 'failed',
        whatsapp_message_id: graphMessageId,
        error: success ? null : lastError?.toString(),
        metadata: {
          latency,
          attempts: attempt
        }
      });
    }

    if (!success) {
      throw new Error(`Falha ao enviar mensagem após ${attempt} tentativas: ${lastError}`);
    }

    return new Response(JSON.stringify({ success: true, graph_data: metaResponseData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('[send_whatsapp_message] Erro fatal:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
