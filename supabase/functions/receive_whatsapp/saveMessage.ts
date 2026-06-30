import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { ParsedWhatsAppMessage } from './types.ts';

export async function saveMessage(parsed: ParsedWhatsAppMessage) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // O telefone do sistema (WhatsApp Business)
  const systemPhone = parsed.raw_payload?.entry?.[0]?.changes?.[0]?.value?.metadata?.display_phone_number || parsed.phone_number_id;
  
  // O telefone do remetente
  const senderPhone = parsed.phone_number;
  const senderName = parsed.contact_name;

  // 1. Encontrar a única conta oficial em whatsapp_accounts (Master)
  const { data: accountData, error: accountError } = await supabase
    .from('whatsapp_accounts')
    .select('id, workspace_id')
    .limit(1)
    .maybeSingle();

  if (accountError || !accountData) {
    console.error('Conta não encontrada para o número:', systemPhone, 'Erro:', accountError);
    return null; 
  }

  const accountId = accountData.id;
  const officialWorkspaceId = accountData.workspace_id;

  // 3. Procurar o contato em whatsapp_contacts APENAS pelo telefone
  const { data: contactData } = await supabase
    .from('whatsapp_contacts')
    .select('id, workspace_id')
    .eq('phone_number', senderPhone)
    .limit(1)
    .maybeSingle();

  if (!contactData) {
    // Caso não exista, NÃO criar contato e NÃO gravar mensagem.
    console.warn(`Mensagem ignorada: O telefone ${senderPhone} não pertence a nenhum usuário cadastrado.`);
    return null;
  }

  const contactId = contactData.id;
  const messageWorkspaceId = contactData.workspace_id;

  // 6. Inserir a mensagem na tabela whatsapp_messages
  const { error: msgError } = await supabase
    .from('whatsapp_messages')
    .upsert({
      workspace_id: messageWorkspaceId,
      account_id: accountId,
      contact_id: contactId,
      direction: 'inbound',
      content: parsed.body,
      status: 'received',
      whatsapp_message_id: parsed.message_id
    }, { onConflict: 'whatsapp_message_id' });

  if (msgError) {
    throw new Error(`Erro ao salvar mensagem: ${msgError.message}`);
  }

  return {
    workspace_id: messageWorkspaceId,
    contact_id: contactId,
    account_id: accountId,
    sender_phone: senderPhone,
    message_id: parsed.message_id,
    message: parsed.body,
    timestamp: parsed.timestamp
  };
}
