import { WhatsAppWebhookPayload, ParsedWhatsAppMessage } from './types.ts';

/**
 * Extracts and normalizes the required data from the Meta webhook payload.
 * If the payload does not contain a message (e.g. status updates like 'read', 'delivered'),
 * it returns null.
 */
export function parsePayload(payload: WhatsAppWebhookPayload): ParsedWhatsAppMessage | null {
  if (!payload || !payload.entry || payload.entry.length === 0) {
    return null;
  }

  const entry = payload.entry[0];
  const change = entry.changes?.[0];
  const value = change?.value;

  if (!value) {
    return null;
  }

  // We are only interested in actual messages in this Sprint (not statuses)
  if (!value.messages || value.messages.length === 0) {
    return null;
  }

  const wabaId = entry.id; // WhatsApp Business Account ID
  const phoneNumberId = value.metadata?.phone_number_id;

  const contact = value.contacts?.[0];
  const contactName = contact?.profile?.name || 'Desconhecido';
  const waId = contact?.wa_id || '';

  const message = value.messages[0];
  const messageId = message.id;
  const timestamp = message.timestamp;
  const messageType = message.type;
  
  // Extract text body or fallback to other type indicator
  let body = '';
  if (messageType === 'text') {
    body = message.text?.body || '';
  } else {
    body = `[Mensagem do tipo: ${messageType}]`;
  }

  const context = message.context || null;

  return {
    phone_number_id: phoneNumberId,
    waba_id: wabaId,
    contact_name: contactName,
    phone_number: message.from || waId, // typically the sender's phone number
    message_id: messageId,
    timestamp,
    message_type: messageType,
    body,
    context,
    raw_payload: payload
  };
}
