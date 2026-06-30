export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
          context?: any;
          [key: string]: any;
        }>;
        statuses?: Array<any>;
      };
      field: string;
    }>;
  }>;
}

export interface ParsedWhatsAppMessage {
  phone_number_id: string;
  waba_id: string; // WhatsApp Business Account ID (usually entry.id)
  contact_name: string;
  phone_number: string;
  message_id: string;
  timestamp: string;
  message_type: string;
  body: string;
  context: any;
  raw_payload: any;
}
