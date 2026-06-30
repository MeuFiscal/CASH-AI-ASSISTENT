import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { verifyWebhook } from './verifyWebhook.ts';
import { validateSignature } from './validateSignature.ts';
import { parsePayload } from './parsePayload.ts';
import { saveMessage } from './saveMessage.ts';
import { sendSuccess, sendError } from './utils.ts';
import { WhatsAppWebhookPayload } from './types.ts';

declare const EdgeRuntime: { waitUntil: (promise: Promise<any>) => void } | undefined;

console.log('Webhook receive_whatsapp iniciado.');

async function processBackgroundMessage(context: any) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing DB env');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[Background] Invocando openai_core para', context.contact_id);

    // 1. Invoca openai_core
    const { data: aiData, error: aiError } = await supabase.functions.invoke('openai_core', {
      body: {
        channel: 'whatsapp',
        workspace_id: context.workspace_id,
        contact_id: context.contact_id,
        message: context.message,
        message_id: context.message_id
      }
    });

    if (aiError) {
      console.error('[Background] Erro na OpenAI:', aiError);
      return;
    }

    const aiResponseText = aiData?.response || aiData?.text || 'Desculpe, não consegui processar sua mensagem.';

    console.log('[Background] Invocando send_whatsapp_message');

    // 2. Invoca send_whatsapp_message
    const { error: sendError } = await supabase.functions.invoke('send_whatsapp_message', {
      body: {
        phone: context.sender_phone,
        message: aiResponseText,
        workspace_id: context.workspace_id,
        contact_id: context.contact_id,
        account_id: context.account_id
      }
    });

    if (sendError) {
      console.error('[Background] Erro no envio WhatsApp:', sendError);
    } else {
      console.log('[Background] Ciclo finalizado com sucesso.');
    }
  } catch (error) {
    console.error('[Background] Fatal error:', error);
  }
}

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);

    // 1. Webhook Verification (Meta Challenge)
    if (req.method === 'GET') {
      return verifyWebhook(req);
    }

    // 2. Receiving Messages
    if (req.method === 'POST') {
      const rawBody = await req.text();

      // Validate Signature
      const isValid = await validateSignature(req, rawBody);
      if (!isValid && Deno.env.get('META_APP_SECRET')) {
        console.warn('Assinatura do payload inválida.');
        // Em produção, a Meta exige que não se aceite payload falso.
        return sendError('Invalid Signature', 401);
      }

      let payload: WhatsAppWebhookPayload;
      try {
        payload = JSON.parse(rawBody);
      } catch (err) {
        console.error('Erro ao fazer parse do JSON:', err);
        return sendError('Invalid JSON', 400);
      }

      // 3. Extração dos dados
      const parsedMessage = parsePayload(payload);
      
      // Se parsedMessage for null, significa que foi um status (entregue/lido) ou outro evento
      if (!parsedMessage) {
        // Retornamos 200 de qualquer forma para a Meta saber que recebemos
        return sendSuccess('Event Ignored');
      }

      // 4. Persistência
      // "A Edge Function deverá gravar imediatamente toda mensagem recebida no banco de dados 
      // antes de executar qualquer regra de negócio."
      const savedContext = await saveMessage(parsedMessage);

      // 5. Iniciar Processamento Assíncrono
      if (savedContext) {
        const promise = processBackgroundMessage(savedContext);
        if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
          EdgeRuntime.waitUntil(promise);
        } else {
          // Fallback se waitUntil não estiver presente
          promise.catch(console.error);
        }
      }

      // Responder HTTP 200 Imediatamente
      return sendSuccess('EVENT_RECEIVED');
    }

    return sendError('Method Not Allowed', 405);
  } catch (error: any) {
    console.error('Erro não tratado na Edge Function:', error);
    // Para não travar a entrega na Meta, se for erro interno grave, podemos enviar 500,
    // Mas a Meta pode tentar re-entregar. 
    return sendError('Internal Server Error', 500);
  }
});
