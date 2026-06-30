import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Send, Paperclip, Mic, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib';
import { PageContainer } from '@/components/PageContainer';

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    text: 'Tudo pronto. O que vamos fazer agora?'
  }
];

export function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const firstName = user?.name?.split(' ')[0] || 'Visitante';

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspaceAndHistory() {
      if (user?.id) {
        // Pega Workspace
        const { data: wsData } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        if (wsData) {
          setWorkspaceId(wsData.workspace_id);
          
          // Tenta encontrar uma conversa ativa recente
          const { data: convData } = await supabase
            .from('conversations')
            .select('id')
            .eq('workspace_id', wsData.workspace_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (convData) {
            setConversationId(convData.id);
            // Puxa mensagens
            const { data: msgData } = await supabase
              .from('messages')
              .select('id, role, content')
              .eq('conversation_id', convData.id)
              .order('created_at', { ascending: true });

            if (msgData && msgData.length > 0) {
              setMessages(msgData.map(m => ({
                id: m.id,
                role: m.role === 'assistant' ? 'ai' : 'user',
                text: m.content
              })));
            } else {
              setMessages(INITIAL_MESSAGES);
            }
          }
        }
      }
    }
    loadWorkspaceAndHistory();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !workspaceId) return;
    
    const userMessage = input;
    // O ID temporário serve só até recarregar da base ou chegar a resposta, mas a UI já reage na hora.
    const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userMessage };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Prepara o histórico
    const history = messages
      .filter(m => m.id !== '1' && !m.id.startsWith('temp-')) 
      .map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));
    
    try {
      const { data, error } = await supabase.functions.invoke('openai_core', {
        body: {
          workspace_id: workspaceId,
          user_id: user?.id,
          conversation_id: conversationId,
          message: userMessage,
          history: history,
          source: 'chat'
        }
      });

      if (error) throw error;

      if (data?.success) {
        if (!conversationId && data.conversation_id) {
          setConversationId(data.conversation_id);
        }
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'ai',
          role: 'ai',
          text: data.response
        }]);
      } else {
        throw new Error(data?.error || 'Erro desconhecido na API');
      }
    } catch (err) {
      console.error('Erro ao chamar OpenAI Core:', err);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'err',
        role: 'ai',
        text: 'Desculpe, ocorreu um erro de conexão com o meu núcleo. Tente novamente em instantes.'
      }]);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-col h-[calc(100vh-200px)] w-full max-w-4xl mx-auto">
        
        {/* Header Narrativo */}
        <div className="flex flex-col gap-4 mb-8 shrink-0">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Bom dia, {firstName} 👋
          </h1>
        </div>

        {/* Histórico de Conversa */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-6 pb-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex flex-col max-w-[85%] sm:max-w-[75%] animate-in fade-in slide-in-from-bottom-2",
                msg.role === 'user' ? "self-end items-end" : "self-start items-start"
              )}
            >
              <div className={cn(
                "px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-lg",
                msg.role === 'user' 
                  ? "bg-[#3B82F6] text-white rounded-br-sm" 
                  : "bg-[#181C28]/80 border border-white/5 text-[#E2E8F0] rounded-bl-sm backdrop-blur-md"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Fixo */}
        <div className="shrink-0 mt-4 relative">
          <div className="flex items-end gap-2 bg-[#181C28]/60 border border-white/10 rounded-3xl p-2 backdrop-blur-xl shadow-2xl focus-within:border-[#3B82F6]/50 focus-within:bg-[#181C28]/80 transition-all duration-300">
            
            <button className="p-3 text-[#A8B3CF] hover:text-white hover:bg-white/5 rounded-full transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent border-none text-white text-[15px] placeholder:text-[#A8B3CF]/50 resize-none max-h-32 min-h-[44px] py-3 px-2 focus:ring-0 outline-none scrollbar-hide"
              rows={1}
            />

            {input.trim() ? (
              <button 
                onClick={handleSend}
                className="p-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full transition-all duration-300 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            ) : (
              <button className="p-3 text-[#A8B3CF] hover:text-white hover:bg-white/5 rounded-full transition-colors shrink-0">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="text-center mt-3">
            <span className="text-[11px] text-[#A8B3CF]/50 font-medium tracking-wide">A IA pode cometer erros. Considere verificar informações importantes.</span>
          </div>
        </div>

        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
