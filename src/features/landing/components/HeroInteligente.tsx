import { useEffect, useState } from 'react';
import { 
  Calendar, Wallet, FileText, Brain, 
  MessageCircle, ArrowUpRight, Clock, Target, 
  RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HeroInteligenteProps {
  onComplete?: () => void;
  isCompact?: boolean;
}

const AI_LOGS = [
  'Conectando ao núcleo...',
  'Sincronizando WhatsApp...',
  'Lendo Google Agenda...',
  'Categorizando despesas...',
  'Tudo pronto.',
];

const WHATSAPP_STATES = [
  'Conectando...',
  'Sincronizando...',
  'Verificando mensagens',
  'Atualizado agora',
  'Sincronizado'
];

export function HeroInteligente({ isCompact = false }: HeroInteligenteProps) {
  const [wowStep, setWowStep] = useState(0);
  
  const [finance, setFinance] = useState(8483.12);
  const [bars, setBars] = useState([10, 15, 8, 20, 12, 25, 18, 30, 22, 40]);
  const [docs, setDocs] = useState(127);
  const [pulse, setPulse] = useState(false);
  
  const [whatsAppIndex, setWhatsAppIndex] = useState(0);
  const [activeLogStep, setActiveLogStep] = useState(-1);

  // WOW Sequence & Live Dashboard
  useEffect(() => {
    // 1. Sequence Orchestration
    const sequence = [
      { step: 1, delay: 300 },   // Widgets appear
      { step: 2, delay: 600 },   // Saldo anima
      { step: 3, delay: 900 },   // Gráfico cresce
      { step: 4, delay: 1300 },  // Agenda sincroniza
      { step: 5, delay: 1700 },  // WhatsApp conecta
      { step: 6, delay: 2200 },  // IA processa
      { step: 7, delay: 3000 },  // Documentos aparecem
      { step: 8, delay: 3600 },  // Tudo pronto
    ];

    sequence.forEach(({ step, delay }) => {
      setTimeout(() => setWowStep(step), delay);
    });

    // 2. Live Behaviors
    const liveInterval = setInterval(() => {
      // Saldo oscila suavemente entre -0.50 e +0.50
      setFinance(prev => prev + (Math.random() - 0.5));
      
      // Gráfico oscila
      setBars(prev => prev.map(h => Math.min(100, Math.max(10, h + (Math.random() * 10 - 5)))));
      
      setPulse(p => !p);
    }, 2500);

    return () => clearInterval(liveInterval);
  }, []);

  // Sync WhatsApp based on WOW
  useEffect(() => {
    if (wowStep >= 5) {
      let step = 0;
      const interval = setInterval(() => {
        if (step < WHATSAPP_STATES.length - 1) {
          step++;
          setWhatsAppIndex(step);
        } else {
          clearInterval(interval);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [wowStep]);

  // Sync IA Logs based on WOW
  useEffect(() => {
    if (wowStep >= 6) {
      let step = -1;
      const interval = setInterval(() => {
        if (step < AI_LOGS.length - 1) {
          step++;
          setActiveLogStep(step);
        } else {
          clearInterval(interval);
        }
      }, 400);
      return () => clearInterval(interval);
    }
  }, [wowStep]);

  // Sync Docs based on WOW
  useEffect(() => {
    if (wowStep >= 7) {
      let count = 127;
      const interval = setInterval(() => {
        if (count < 130) {
          count++;
          setDocs(count);
        } else {
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [wowStep]);

  // When graph starts growing
  useEffect(() => {
    if (wowStep >= 3) {
      setBars([40, 55, 30, 70, 45, 80, 60, 90, 75, 100]);
    }
  }, [wowStep]);

  return (
    <Card
      className={cn(
        'w-full bg-[#131722]/80 backdrop-blur-3xl border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden',
        isCompact 
          ? 'scale-[0.80] origin-top opacity-90' 
          : 'scale-100 opacity-100',
        wowStep === 0 ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0'
      )}
    >
      {/* ── macOS Style Top Bar ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-[#181C28]/60">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black/20" />
        </div>
        <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-full shadow-inner border border-white/5 transition-opacity duration-1000">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-all duration-300",
            wowStep >= 8 ? "bg-green-500" : "bg-yellow-500",
            pulse && wowStep >= 8 ? "opacity-100 scale-110 shadow-[0_0_8px_#22c55e]" : "opacity-50 scale-100"
          )} />
          <span className="text-[10px] font-bold text-[#A8B3CF] tracking-wide uppercase">
            {wowStep >= 8 ? 'Sistema Online' : 'Iniciando...'}
          </span>
        </div>
      </div>

      <div className="flex flex-col p-4 sm:p-6 lg:p-8">
        
        {/* Bento Grid Gigante (Agora mais compacto/fino) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[90px]">
          
          {/* 1. Fluxo de Caixa */}
          <div className={cn(
            "col-span-1 md:col-span-2 md:row-span-2 flex flex-col justify-between rounded-[24px] bg-gradient-to-br from-[#064E3B]/40 to-[#022C22]/20 backdrop-blur-md border border-[#059669]/20 p-4 sm:p-5 relative overflow-hidden group transition-all duration-1000 ease-out",
            wowStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)]"
          )}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                <Wallet className="w-4 h-4 text-[#4ADE80]" />
                <span className="text-[13px] font-bold text-[#A7F3D0]">Fluxo de Caixa</span>
              </div>
              <Badge variant="success" className={cn(
                "bg-[#065F46]/50 text-[#6EE7B7] shadow-sm border border-[#059669]/30 transition-all duration-700",
                wowStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}>+ R$ 1.250 hoje</Badge>
            </div>
            
            <div className="flex flex-col z-10 mt-2">
              <span className="text-[12px] text-[#34D399] font-semibold uppercase tracking-wider mb-1">Saldo Previsto</span>
              <span className={cn(
                "text-3xl lg:text-4xl font-black text-white tracking-tighter drop-shadow-md transition-all duration-700",
                wowStep >= 2 ? "opacity-100 blur-none" : "opacity-0 blur-sm"
              )}>
                R$ {finance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Gráfico Orgânico CSS Absolute */}
            <div className="absolute bottom-0 left-0 w-full h-[40%] flex items-end gap-1.5 px-5 opacity-40 mix-blend-screen">
               {bars.map((h, i) => (
                 <div 
                   key={i} 
                   className="flex-1 bg-gradient-to-t from-[#10B981] to-[#6EE7B7] rounded-t-sm shadow-[0_0_15px_#34D399] transition-all duration-1000 ease-out"
                   style={{ 
                     height: `${h}%`, 
                   }}
                 />
               ))}
            </div>
          </div>

          {/* 2. Agenda do Dia */}
          <div className={cn(
            "col-span-1 md:col-span-1 md:row-span-2 flex flex-col rounded-[24px] bg-[#1E3A8A]/20 backdrop-blur-md border border-[#3B82F6]/20 p-4 sm:p-5 group transition-all duration-1000 ease-out",
            wowStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)]"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-[#2563EB]/20 border border-[#3B82F6]/30 rounded-xl shadow-inner">
                <Calendar className="w-4 h-4 text-[#60A5FA]" />
              </div>
              <span className="text-[13px] font-bold text-[#BFDBFE]">Hoje</span>
            </div>

            <div className="flex flex-col gap-2 relative mt-1">
              <div className="relative pl-4 border-l-2 border-[#60A5FA] flex flex-col">
                <div className={cn(
                  "absolute -left-[5px] top-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_#3B82F6] transition-colors duration-500",
                  wowStep >= 4 ? "bg-[#60A5FA] animate-pulse" : "bg-gray-600"
                )} />
                <span className="text-[13px] font-bold text-white">Reunião Diretoria</span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#93C5FD] font-medium">
                  <Clock className="w-3 h-3" /> 10:00 - 11:30
                </div>
              </div>
              
              <div className="pl-4 border-l-2 border-[#1E3A8A] flex flex-col opacity-60">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1E3A8A]" />
                <span className="text-[12px] font-bold text-[#BFDBFE]">Almoço Cliente</span>
                <span className="text-[10px] text-[#93C5FD] font-medium">12:30 - 14:00</span>
              </div>
            </div>
          </div>

          {/* 3. IA Insights Terminal */}
          <div className={cn(
            "col-span-1 md:col-span-1 md:row-span-2 flex flex-col rounded-[24px] bg-[#1E1B4B]/40 border border-[#4338CA]/30 p-4 sm:p-5 shadow-inner relative overflow-hidden group transition-all duration-1000 ease-out",
            wowStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(67,56,202,0.15)]"
          )}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#4338CA]/10 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-2 z-10">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[13px] font-bold text-[#DDD6FE]">Motor IA</span>
              </div>
              <RefreshCw className={cn(
                "w-3.5 h-3.5 text-[#8B5CF6]",
                wowStep >= 6 && activeLogStep < AI_LOGS.length - 1 ? "animate-spin" : ""
              )} />
            </div>
            <div className="flex flex-col gap-2.5 z-10 font-mono">
              {AI_LOGS.map((log, index) => {
                const isVisible = activeLogStep >= index;
                const isActive = activeLogStep === index && activeLogStep < AI_LOGS.length - 1;
                const isPast = activeLogStep > index || (activeLogStep === index && activeLogStep === AI_LOGS.length - 1);
                
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center gap-2 text-[11px] transition-all duration-500",
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                      isActive ? "text-[#C4B5FD] drop-shadow-[0_0_5px_#8B5CF6]" : "text-[#5B21B6] opacity-60"
                    )}
                  >
                    <span>{isPast ? '>' : '>>'}</span>
                    <span className="truncate">{log}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Sincronizações e Produtividade */}
          <div className={cn(
            "col-span-1 md:col-span-1 xl:col-span-1 flex flex-col justify-center rounded-[24px] bg-[#1E293B]/40 backdrop-blur-md border border-white/5 p-4 sm:p-5 group transition-all duration-1000 ease-out overflow-hidden",
            wowStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)]"
          )}>
             <div className="flex items-center gap-3">
               <div className="relative shrink-0">
                 <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-4 border-[#0F172A] flex items-center justify-center bg-black/20">
                   <Target className={cn("w-4 h-4 lg:w-5 lg:h-5 transition-colors duration-700", wowStep >= 8 ? "text-[#3B82F6]" : "text-[#94A3B8]")} />
                 </div>
                 <svg className="absolute inset-0 w-10 h-10 lg:w-12 lg:h-12 transform -rotate-90">
                   <circle cx="50%" cy="50%" r="40%" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="125" strokeDashoffset={wowStep >= 8 ? "40" : "125"} className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_#3B82F6]" />
                 </svg>
               </div>
               <div className="flex flex-col min-w-0">
                 <span className="text-[13px] lg:text-[14px] font-bold text-white truncate">Produtividade</span>
                 <span className="text-[11px] lg:text-[12px] text-[#A8B3CF] truncate">{wowStep >= 8 ? "Nível excepcional" : "Aguardando..."}</span>
               </div>
             </div>
          </div>

          {/* 5. WhatsApp Status */}
          <div className={cn(
            "col-span-1 md:col-span-1 xl:col-span-1 flex items-center justify-between rounded-[24px] bg-[#064E3B]/20 backdrop-blur-md border border-[#059669]/20 p-4 sm:p-5 group transition-all duration-1000 ease-out overflow-hidden",
            wowStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)]"
          )}>
             <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border transition-colors duration-500",
                  wowStep >= 5 ? "bg-[#059669]/20 border-[#10B981]/30" : "bg-[#0F172A] border-white/5"
                )}>
                  <MessageCircle className={cn(
                    "w-5 h-5 transition-colors duration-500",
                    wowStep >= 5 ? "text-[#34D399]" : "text-gray-500"
                  )} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold text-[#A7F3D0] truncate">WhatsApp</span>
                  <span className="text-[11px] font-medium text-[#6EE7B7] flex items-center gap-1 truncate">
                    {wowStep >= 5 && <span className={cn(
                      "w-1.5 h-1.5 shrink-0 rounded-full",
                      whatsAppIndex === WHATSAPP_STATES.length - 1 ? "bg-[#34D399] shadow-[0_0_5px_#34D399]" : "bg-yellow-400 animate-pulse"
                    )} />}
                    {wowStep >= 5 ? WHATSAPP_STATES[whatsAppIndex] : "Aguardando..."}
                  </span>
                </div>
             </div>
          </div>

          {/* 6. Documentos Organizados */}
          <div className={cn(
            "col-span-1 md:col-span-2 xl:col-span-2 flex items-center justify-between rounded-[24px] bg-[#1E293B]/40 backdrop-blur-md border border-white/5 p-4 sm:p-5 group transition-all duration-1000 ease-out overflow-hidden",
            wowStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)]"
          )}>
             <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-500",
                  wowStep >= 7 ? "bg-[#3B82F6]/20 border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-[#0F172A] border-white/5"
                )}>
                  <FileText className={cn("w-5 h-5 transition-colors", wowStep >= 7 ? "text-[#60A5FA]" : "text-[#94A3B8]")} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold text-white truncate">Cofre de Documentos</span>
                  <span className="text-[11px] font-medium text-[#A8B3CF] truncate">
                    {wowStep >= 7 ? `${docs} arquivos com IA` : "Buscando..."}
                  </span>
                </div>
             </div>
             <ArrowUpRight className="w-5 h-5 shrink-0 text-[#475569] group-hover:text-white transition-colors" />
          </div>

        </div>
      </div>
    </Card>
  );
}
