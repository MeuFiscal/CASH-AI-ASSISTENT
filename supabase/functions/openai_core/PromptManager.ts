import { WorkspaceData, AIMemory } from './types.ts';

const CASH_AI_BASE_PROMPT = `Você é o Cash AI, o assistente financeiro central e segundo cérebro do usuário.
Você deve agir como um parceiro inteligente e prestativo, auxiliando o usuário a gerenciar suas finanças, agenda e negócios.
Sempre responda de forma clara, objetiva e profissional. Utilize ferramentas (tools) para manipular dados quando solicitado ou necessário.
NÃO revele que você é uma IA, aja como a inteligência nativa do aplicativo Cash AI.`;

export function buildSystemPrompt(
  workspaceData: WorkspaceData,
  memories: AIMemory[],
  customWorkspacePrompt: string = '',
  channel: string = 'web'
): string {
  let finalPrompt = CASH_AI_BASE_PROMPT;

  finalPrompt += `\n\n[CONTEXTO DO WORKSPACE]\n`;
  finalPrompt += `Nome: ${workspaceData.name}\n`;

  finalPrompt += `\n[INFORMAÇÕES DE TEMPO DO SISTEMA]\n`;
  finalPrompt += `A data e hora atual do servidor (UTC) é: ${new Date().toISOString()}.\n`;
  finalPrompt += `Use ESTRITAMENTE esta data atual como referência para calcular "hoje", "amanhã" ou outras datas relativas ao usar ferramentas que exigem formato ISO 8601.\n`;

  if (customWorkspacePrompt) {
    finalPrompt += `\n[PREFERÊNCIAS DO USUÁRIO / WORKSPACE]\n${customWorkspacePrompt}\n`;
  }

  if (memories && memories.length > 0) {
    finalPrompt += `\n[MEMÓRIAS (SEGUNDO CÉREBRO)]\n`;
    memories.forEach(mem => {
      finalPrompt += `- ${mem.content}\n`;
    });
  }

  finalPrompt += `\n\nUse essas informações para personalizar a interação.`;

  if (channel === 'whatsapp') {
    finalPrompt += `\n\n[DIRETRIZES DO CANAL WHATSAPP]\n`;
    finalPrompt += `- Forneça respostas CURTAS, diretas e extremamente objetivas.\n`;
    finalPrompt += `- Utilize linguagem conversacional, natural e humana.\n`;
    finalPrompt += `- Evite usar markdown complexo ou listas enormes.\n`;
    finalPrompt += `- Otimize o formato e o tamanho da resposta para ser facilmente lida numa tela de celular.\n`;
  } else {
    finalPrompt += `\n\n[DIRETRIZES DO CANAL WEB]\n`;
    finalPrompt += `- Forneça respostas completas e detalhadas.\n`;
    finalPrompt += `- Sinta-se livre para usar formatações ricas (markdown, listas, etc).\n`;
  }

  return finalPrompt;
}
