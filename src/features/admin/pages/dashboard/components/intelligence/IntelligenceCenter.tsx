import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function IntelligenceCenter() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Olá! Sou seu assistente de inteligência de negócios. Pergunte qualquer coisa sobre sua base de clientes, receita, workspaces ou uso da plataforma.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Qual workspace mais cresce em receita?",
    "Quantos clientes tenho ativos hoje?",
    "Quais workspaces estão sem assinatura?",
    "Qual o custo com OpenAI este mês?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, suggestionText?: string) => {
    e?.preventDefault();
    const text = suggestionText || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intelligence-center`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session?.access_token}`
        },
        body: JSON.stringify({ query: text })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Edge Function Error:', errText);
        throw new Error(errText);
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply || 'Desculpe, não consegui analisar os dados no momento.' };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `❌ Erro: ${error.message || 'Houve um erro ao processar sua solicitação.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl w-full h-[600px] flex flex-col animate-in fade-in duration-500 overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/5 bg-[#0A0D14]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full bg-[#0A0D14] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">Centro de Inteligência <Sparkles className="w-4 h-4 text-purple-400" /></h3>
            <p className="text-xs text-[#A8B3CF]">Análise autônoma em tempo real</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#3B82F6]' : 'bg-[#181C28] border border-white/10'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-purple-400" />}
            </div>
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#3B82F6] text-white rounded-tr-sm' : 'bg-[#202534] text-[#E2E8F0] border border-white/5 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#181C28] border border-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div className="p-4 rounded-2xl bg-[#202534] border border-white/5 rounded-tl-sm">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#0A0D14]/80 border-t border-white/5 flex flex-col gap-3">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button 
                key={i} 
                onClick={() => handleSubmit(undefined, sug)}
                className="text-xs bg-[#181C28] hover:bg-[#202534] text-[#A8B3CF] hover:text-white px-3 py-1.5 rounded-full border border-white/5 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Faça uma pergunta sobre seus negócios..."
            className="w-full bg-[#181C28] border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white placeholder:text-[#A8B3CF] focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#181C28] disabled:text-[#A8B3CF] text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
