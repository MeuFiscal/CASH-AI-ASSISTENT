import { useEffect, useState } from 'react';
import { Check, Brain, ChevronLeft, Video, Phone, Mic, Plus, Smile, Calendar, Clock, Bell, AlignLeft } from 'lucide-react';
import { cn } from '@/lib';

const waMessages = [
  { id: 1, role: 'user', text: 'Marcar reunião hoje as 14h com o time todo', delay: 1000 },
  { id: 2, role: 'assistant', text: 'A reunião com o time todo está marcada para hoje às 14h! 🎉 Vou te enviar um lembrete às 12h para garantir que você não esqueça.', delay: 4000 },
  { id: 3, role: 'assistant', text: 'Se precisar de mais alguma coisa, estou por aqui! 😃🚀', delay: 6000 },
];

export function AgendaShowcase({ className }: { className?: string }) {
  const [activeView, setActiveView] = useState<'whatsapp' | 'calendar'>('whatsapp');
  const [waVisibleMessages, setWaVisibleMessages] = useState<number[]>([]);
  const [waIsTyping, setWaIsTyping] = useState(false);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    const runSequence = () => {
      // 1. Start WhatsApp Sequence
      setActiveView('whatsapp');
      setWaVisibleMessages([]);
      setWaIsTyping(false);
      
      waMessages.forEach((msg, index) => {
        if (msg.role === 'assistant' && index > 0) {
          timeouts.push(setTimeout(() => setWaIsTyping(true), msg.delay - 1500));
        }
        timeouts.push(
          setTimeout(() => {
            setWaIsTyping(false);
            setWaVisibleMessages((prev) => [...prev, msg.id]);
          }, msg.delay)
        );
      });
      
      // 2. Switch to Calendar View after reading WA messages
      timeouts.push(
        setTimeout(() => {
          setActiveView('calendar');
        }, 10000)
      );

      // 3. Loop back
      timeouts.push(setTimeout(runSequence, 16000));
    };

    runSequence();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className={cn("w-full max-w-[1200px] flex flex-col lg:flex-row-reverse items-center justify-between gap-12 sm:gap-16 lg:gap-8 relative z-20 mx-auto px-4", className)}>
      
      {/* ── Text Content (Right) ── */}
      <div className="flex-1 flex flex-col items-start text-left max-w-[500px]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
          <span className="text-[12px] font-medium text-[#A8B3CF]">Agenda Inteligente</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-black tracking-tight text-white leading-[1.1] mb-6">
          Nunca mais esqueça <br />
          um compromisso.
        </h2>
        
        <p className="text-[16px] md:text-[18px] text-[#A8B3CF] leading-relaxed font-medium mb-12">
          Tenha lembretes e resumos diários. Registre compromissos no WhatsApp falando do seu jeito: a IA entende e organiza sua rotina. Tudo sincronizado com seu Google Agenda.
        </p>

        {/* Rich Feature List */}
        <div className="flex flex-col gap-8">
          {[
            { 
              title: 'Criação Natural', 
              desc: 'Mande um áudio "Almoço amanhã 12h com o Marcos" e deixe que a IA crie o evento automaticamente para você.',
              icon: Mic,
              color: 'text-[#EC4899]',
              bg: 'bg-[#EC4899]/10'
            },
            { 
              title: 'Lembretes Ativos', 
              desc: 'Receba alertas direto no WhatsApp horas antes dos seus compromissos mais importantes. Chega de atrasos.',
              icon: Bell,
              color: 'text-[#F59E0B]',
              bg: 'bg-[#F59E0B]/10'
            },
            { 
              title: 'Sync com Google Agenda', 
              desc: 'Toda alteração feita via chat reflete instantaneamente no seu Google Calendar, mantendo tudo unificado.',
              icon: Calendar,
              color: 'text-[#3B82F6]',
              bg: 'bg-[#3B82F6]/10'
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-300">
                <item.icon className={cn("w-6 h-6", item.color)} />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[17px] font-bold text-white mb-1.5 tracking-tight">{item.title}</h4>
                <p className="text-[14px] text-[#A8B3CF] leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mockups Area (Left) ── */}
      <div className="flex-1 w-full max-w-[420px] relative perspective-1000 flex justify-center mt-10 lg:mt-0">
        
        {/* Glow Behind */}
        <div className="absolute inset-0 bg-[#EC4899]/10 blur-[120px] rounded-full pointer-events-none z-0" />
        
        {/* Floating Orbs */}
        <div className="absolute top-[20%] -right-[10%] w-16 h-16 rounded-full bg-[#EC4899]/20 border border-[#EC4899]/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-float z-0">
          <Clock className="w-6 h-6 text-[#F472B6]" />
        </div>
        <div className="absolute bottom-[20%] -left-[10%] w-14 h-14 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-float-slow delay-500 z-0">
          <Calendar className="w-5 h-5 text-[#FCD34D]" />
        </div>

        {/* Device Frame */}
        <div className="relative bg-[#F3F4F6] border-[6px] border-[#E5E7EB] rounded-[50px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] aspect-[9/19] flex flex-col ring-1 ring-black/5 transform rotate-[2deg] hover:rotate-0 transition-transform duration-700 ease-out z-10 w-[280px] sm:w-[320px]">
          
          {/* Hardware Details */}
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
            <div className="w-[120px] h-7 bg-[#E5E7EB] rounded-b-3xl relative flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-black/80 shadow-inner" />
              <div className="w-12 h-1.5 rounded-full bg-black/20" />
            </div>
          </div>
          
          <div className="h-10 w-full flex items-end justify-between px-6 pb-1 text-black/80 font-semibold text-[13px] z-40 relative pt-1 bg-[#F3F4F6]">
            <span>09:28</span>
            <div className="flex items-center gap-1.5">
               <div className="w-4 h-3 bg-black/80 mask mask-signal" />
               <div className="w-4 h-3 bg-black/80 mask mask-wifi" />
               <div className="w-6 h-3 border border-black/80 rounded-sm relative">
                  <div className="absolute inset-y-[1px] left-[1px] right-[2px] bg-black/80 rounded-sm" />
               </div>
            </div>
          </div>

          {/* View Container */}
          <div className="flex-1 relative overflow-hidden bg-white">
            
            {/* ── WhatsApp View ── */}
            <div className={cn(
              "absolute inset-0 flex flex-col bg-[#EFEAE2] transition-transform duration-700 ease-in-out",
              activeView === 'whatsapp' ? "translate-x-0" : "-translate-x-full"
            )}>
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

              {/* Chat Content */}
              <div className="flex-1 relative overflow-y-auto px-3 py-5 flex flex-col gap-3 scrollbar-hide">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/409/48/HD-wallpaper-whatsapp-background-abstract-texture-vector.jpg")', backgroundSize: '150px' }} />
                
                <div className="flex justify-center mb-1 relative z-10">
                  <span className="bg-white/80 shadow-sm text-[#4B5563] text-[11px] font-medium px-3 py-1 rounded-lg">Hoje</span>
                </div>

                {waMessages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex transition-all duration-500 transform origin-bottom relative z-10",
                    waVisibleMessages.includes(msg.id) ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 absolute pointer-events-none",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}>
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 shadow-sm text-[14px] leading-snug relative",
                      msg.role === 'user' ? "bg-[#D9FDD3] text-[#111827] rounded-tr-sm" : "bg-white text-[#111827] rounded-tl-sm"
                    )}>
                      {msg.role === 'assistant' && <div className="text-[11px] font-bold text-[#D82D7E] mb-0.5">Cash AI</div>}
                      {msg.text}
                      <div className="text-[10px] opacity-50 text-right mt-1 font-medium -mb-1 flex justify-end items-center gap-1">
                        09:28 {msg.role === 'user' && <Check className="w-3 h-3 text-[#3B82F6]" />}
                      </div>
                    </div>
                  </div>
                ))}

                {waIsTyping && (
                  <div className="flex justify-start transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative z-10">
                     <div className="bg-white text-[#6B7280] rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm flex items-center gap-1.5 w-fit h-9">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                  </div>
                )}
              </div>
              
              {/* WA Input */}
              <div className="bg-[#F3F4F6] border-t border-black/5 px-2 py-2 flex items-center gap-2 z-40 relative pb-6">
                <Plus className="w-6 h-6 text-[#007AFF]" />
                <div className="flex-1 bg-white border border-black/5 rounded-full h-9 flex items-center px-3 justify-between shadow-sm">
                  <span className="text-[14px] text-[#9CA3AF]">Mensagem</span>
                  <Smile className="w-5 h-5 text-[#9CA3AF]" />
                </div>
                <div className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white shadow-sm">
                  <Mic className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* ── Google Calendar View ── */}
            <div className={cn(
              "absolute inset-0 flex flex-col bg-white transition-transform duration-700 ease-in-out",
              activeView === 'calendar' ? "translate-x-0" : "translate-x-full"
            )}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <AlignLeft className="w-5 h-5 text-gray-600" />
                  <span className="text-[16px] font-medium text-gray-800">Google Agenda</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#E83E8C] text-white flex items-center justify-center text-[11px] font-bold">
                  JS
                </div>
              </div>
              
              {/* Month & Nav */}
              <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-[18px] font-medium text-gray-800">Maio 2026</h3>
                <div className="flex gap-4 text-gray-500">
                  <ChevronLeft className="w-5 h-5" />
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-5 text-center px-4 mb-2">
                {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-500 font-medium">{day}</span>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[14px]",
                      i === 3 ? "bg-[#1A73E8] text-white font-medium shadow-sm" : "text-gray-700"
                    )}>
                      {28 + i > 31 ? i : 28 + i}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="flex-1 overflow-y-auto px-4 pb-8 relative pt-2">
                <div className="absolute left-[52px] top-0 bottom-0 border-l border-gray-100" />
                
                {[9, 10, 11, 12, 13, 14, 15].map((hour) => (
                  <div key={hour} className="flex min-h-[50px] relative">
                    <div className="w-10 text-[10px] text-gray-400 -mt-2.5 font-medium">{String(hour).padStart(2, '0')}:00</div>
                    <div className="flex-1 border-t border-gray-100 ml-3" />
                  </div>
                ))}

                {/* Events */}
                <div className="absolute top-[2px] left-[58px] right-2 bg-[#E8F0FE] border-l-4 border-[#1A73E8] rounded-r-md px-2 py-1 shadow-sm">
                  <p className="text-[#1A73E8] text-[13px] font-semibold">Dentista</p>
                  <p className="text-[#1A73E8]/80 text-[10px]">09:00 - 10:00</p>
                </div>

                <div className="absolute top-[102px] left-[58px] right-2 bg-[#E6F4EA] border-l-4 border-[#1E8E3E] rounded-r-md px-2 py-1 shadow-sm">
                  <p className="text-[#1E8E3E] text-[13px] font-semibold">Call de vendas</p>
                  <p className="text-[#1E8E3E]/80 text-[10px]">11:00 - 12:00</p>
                </div>

                <div className={cn(
                  "absolute top-[252px] left-[58px] right-2 bg-[#F3E8FD] border-l-4 border-[#9333EA] rounded-r-md px-2 py-1 shadow-sm transition-all duration-700 transform origin-top",
                  activeView === 'calendar' ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                )}>
                  <p className="text-[#9333EA] text-[13px] font-semibold">Reunião com o time</p>
                  <p className="text-[#9333EA]/80 text-[10px]">14:00 - 15:00</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
