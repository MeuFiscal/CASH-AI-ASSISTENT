export interface AIContextPayload {
  workspace_id: string;
  user_id: string;
  conversation_id?: string;
  message: string;
  history?: { role: string; content: string }[];
  source?: 'chat' | 'whatsapp';
  channel?: string;
  contact_id?: string;
  message_id?: string;
}

export interface WorkspaceData {
  id: string;
  name: string;
  plan?: string;
}

export interface AIConfiguration {
  base_prompt?: string;
  temperature?: number;
  model?: string;
}

export interface AIMemory {
  id: string;
  content: string;
  importance?: number;
}
