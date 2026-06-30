import { useEffect, useState } from 'react';
import { Check, Brain, ChevronLeft, Video, Phone, Mic, Plus, Smile, DollarSign, Calendar, FileText, MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib';

const messages = [
  { id: 1, role: 'assistant', text: 'Já categorizei, salvei no painel e deixei tudo bonito por lá ✨', delay: 1000 },
  { id: 2, role: 'user', text: 'Cash AI, gastei 45 reais no uber', delay: 3000 },
  { id: 3, role: 'assistant', text: 'Missão cumprida! 🎉 Consegui registrar sua despesa de R$ 45,00 no Uber com sucesso! 🚗', delay: 6000 },
  { id: 4, role: 'assistant', text: 'Se precisar de mais alguma coisa, é só falar! 😃✨', delay: 8000 },
];

export function WhatsAppShowcase({ className }: { className?: string }) {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    const runSequence = () => {
      setVisibleMessages([]);
      setIsTyping(false);
      
      messages.forEach((msg, index) => {
        // Show typing indicator a bit before the assistant messages
        if (msg.role === 'assistant' && index > 0) {
          timeouts.push(
            setTimeout(() => setIsTyping(true), msg.delay - 1500)
          );
        }

        timeouts.push(
          setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages((prev) => [...prev, msg.id]);
          }, msg.delay)
        );
      });
      
      timeouts.push(setTimeout(runSequence, 14000));
    };

    runSequence();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className={cn("w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 lg:gap-8 relative z-20 mx-auto px-4", className)}>
      
      {/* ── Text Content (Left) ── */}
      <div className="flex-1 flex flex-col items-start text-left max-w-[500px]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[12px] font-medium text-[#A8B3CF]">IA no WhatsApp para sua rotina</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-black tracking-tight text-white leading-[1.1] mb-6">
          Anote seus gastos <br /> por áudio ou texto.
        </h2>
        
        <p className="text-[16px] md:text-[18px] text-[#A8B3CF] leading-relaxed font-medium mb-12">
          Registre cada despesa ou receita em segundos. O Cash AI ouve seus áudios, entende sua fala natural e categoriza tudo automaticamente.
        </p>

        {/* Rich Feature List */}
        <div className="flex flex-col gap-8">
          {[
            { 
              title: 'Gestão via WhatsApp', 
              desc: 'Esqueça planilhas complexas. Registre, consulte e edite suas finanças com mensagens de áudio ou texto naturais.',
              icon: MessageCircle,
              color: 'text-[#3B82F6]',
              bg: 'bg-[#3B82F6]/10'
            },
            { 
              title: 'Categorização Automática', 
              desc: 'A Inteligência Artificial analisa o contexto da sua mensagem e aloca o gasto na categoria exata na mesma hora.',
              icon: Sparkles,
              color: 'text-[#8B5CF6]',
              bg: 'bg-[#8B5CF6]/10'
            },
            { 
              title: 'Resumos Inteligentes', 
              desc: 'Receba um briefing completo sempre que pedir, com o que você gastou, economizou e alertas de orçamento.',
              icon: TrendingUp,
              color: 'text-[#10B981]',
              bg: 'bg-[#10B981]/10'
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-5 group">
              {/* Premium Icon Box */}
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-300">
                <item.icon className={cn("w-6 h-6", item.color)} />
              </div>
              {/* Rich Text */}
              <div className="flex flex-col justify-center">
                <h4 className="text-[17px] font-bold text-white mb-1.5 tracking-tight">{item.title}</h4>
                <p className="text-[14px] text-[#A8B3CF] leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WhatsApp Mockup (Right) ── */}
      <div className="flex-1 w-full max-w-[420px] relative perspective-1000 flex justify-center mt-10 lg:mt-0">
        
        {/* Floating Orbs (Background layer) */}
        <div className="absolute top-[10%] -left-[10%] w-16 h-16 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-float-slow z-0">
          <DollarSign className="w-6 h-6 text-[#A78BFA]" />
        </div>
        <div className="absolute top-[50%] -right-[15%] w-14 h-14 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-float-slower z-0 delay-700">
          <Calendar className="w-5 h-5 text-[#93C5FD]" />
        </div>
        <div className="absolute bottom-[15%] -left-[5%] w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-float z-0 delay-1000">
          <FileText className="w-4 h-4 text-[#6EE7B7]" />
        </div>

        {/* Giant Glow Behind Phone */}
        <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full pointer-events-none z-0" />
        
        {/* Phone Frame - Light Theme Premium */}
        <div className="relative bg-[#F3F4F6] border-[6px] border-[#E5E7EB] rounded-[50px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] aspect-[9/19] flex flex-col ring-1 ring-black/5 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out z-10 w-[280px] sm:w-[320px]">
          
          {/* Hardware Details */}
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
            <div className="w-[120px] h-7 bg-[#E5E7EB] rounded-b-3xl relative flex items-center justify-center gap-3">
              {/* Camera */}
              <div className="w-3 h-3 rounded-full bg-black/80 shadow-inner" />
              {/* Speaker */}
              <div className="w-12 h-1.5 rounded-full bg-black/20" />
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="h-10 w-full flex items-end justify-between px-6 pb-1 text-black/80 font-semibold text-[13px] z-40 relative pt-1">
            <span>17:13</span>
            <div className="flex items-center gap-1.5">
               <div className="w-4 h-3 bg-black/80 mask mask-signal" />
               <div className="w-4 h-3 bg-black/80 mask mask-wifi" />
               <div className="w-6 h-3 border border-black/80 rounded-sm relative">
                  <div className="absolute inset-y-[1px] left-[1px] right-[2px] bg-black/80 rounded-sm" />
               </div>
            </div>
          </div>

          {/* WhatsApp Header */}
          <div className="bg-[#F3F4F6]/90 backdrop-blur-xl border-b border-black/5 px-3 py-2 flex items-center gap-2.5 z-40 relative">
            <ChevronLeft className="w-6 h-6 text-[#007AFF] cursor-pointer" />
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-sm overflow-hidden">
                <Brain className="w-5 h-5 text-[#3B82F6]" />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-[15px] font-semibold text-black flex items-center gap-1">Cash AI <Check className="w-3.5 h-3.5 text-[#007AFF]" /></span>
              <span className="text-[11px] text-[#6B7280]">online agora</span>
            </div>
            <div className="flex items-center gap-4 text-[#007AFF] pr-1">
              <Video className="w-5 h-5" />
              <Phone className="w-4 h-4" />
            </div>
          </div>

          {/* Chat Background - WhatsApp Default Light */}
          <div className="flex-1 relative bg-[#EFEAE2] overflow-y-auto px-3 py-5 flex flex-col gap-3 scrollbar-hide">
            {/* WhatsApp Doodle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/409/48/HD-wallpaper-whatsapp-background-abstract-texture-vector.jpg")', backgroundSize: '150px' }} />
            
            {/* Date Tag */}
            <div className="flex justify-center mb-1 relative z-10">
              <span className="bg-white/80 shadow-sm text-[#4B5563] text-[11px] font-medium px-3 py-1 rounded-lg">
                Hoje
              </span>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={cn(
                  "flex transition-all duration-500 transform origin-bottom relative z-10",
                  visibleMessages.includes(msg.id) ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 absolute pointer-events-none",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 shadow-sm text-[14px] leading-snug relative",
                  msg.role === 'user' 
                    ? "bg-[#D9FDD3] text-[#111827] rounded-tr-sm" 
                    : "bg-white text-[#111827] rounded-tl-sm"
                )}>
                  {msg.role === 'assistant' && <div className="text-[11px] font-bold text-[#D82D7E] mb-0.5">Cash AI</div>}
                  {msg.text}
                  <div className="text-[10px] opacity-50 text-right mt-1 font-medium -mb-1 flex justify-end items-center gap-1">
                    09:17 {msg.role === 'user' && <Check className="w-3 h-3 text-[#3B82F6]" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative z-10">
                 <div className="bg-white text-[#6B7280] rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm flex items-center gap-1.5 w-fit h-9">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="bg-[#F3F4F6] border-t border-black/5 px-2 py-2 flex items-center gap-2 z-40 relative pb-6">
            <Plus className="w-6 h-6 text-[#007AFF]" />
            <div className="flex-1 bg-white border border-black/5 rounded-full h-9 flex items-center px-3 justify-between shadow-sm">
              <span className="text-[14px] text-[#9CA3AF] select-none">Mensagem</span>
              <Smile className="w-5 h-5 text-[#9CA3AF]" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
