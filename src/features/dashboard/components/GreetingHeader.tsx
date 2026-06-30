import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, ArrowDown, ArrowUp, Calendar, MessageCircle, FileText, Brain } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

export function GreetingHeader() {
  const { user } = useAuth();
  const { data, status } = useDashboard();
  const [timeOfDay, setTimeOfDay] = useState('Bom dia');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now);
      
      const hour = now.getHours();
      if (hour >= 12 && hour < 18) setTimeOfDay('Boa tarde');
      else if (hour >= 18 || hour < 5) setTimeOfDay('Boa noite');
      else setTimeOfDay('Bom dia');
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(currentDate).replace('.', ''); // Ex: seg, 29 de jun

  const formattedTime = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(currentDate);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // If loading, show a skeleton version
  if (status === 'loading') {
    return (
      <header className="w-full flex flex-col gap-5 mb-2 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-64 h-10 bg-white/5 rounded-full" />
            <div className="w-48 h-4 bg-white/5 rounded-full" />
          </div>
          <div className="w-32 h-12 bg-white/5 rounded-2xl" />
        </div>
      </header>
    );
  }

  const financial = data?.financial || { balance: 0, income_today: 0, expense_today: 0 };
  const agendaCount = data?.agenda?.length || 0;
  const msgCount = data?.whatsapp?.length || 0;

  return (
    <header className="w-full flex flex-col gap-5 mb-2 animate-in fade-in slide-in-from-top-4 duration-1000">
      
      {/* 1. Saudação e Resumo Curto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {timeOfDay}, {user?.name?.split(' ')[0] || 'Visitante'} <span className="animate-wave inline-block origin-bottom-right">👋</span>
            </h1>
          </div>
          <p className="text-[15px] text-[#A8B3CF] font-medium tracking-wide">
            Enquanto você descansava, organizei tudo para você.
          </p>
        </div>

        {/* Date and Time */}
        <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-0 px-4 py-3 sm:py-2 rounded-2xl bg-[#181C28]/60 border border-white/[0.03] backdrop-blur-xl w-fit shrink-0">
          <span className="text-[14px] md:text-[15px] font-bold text-white tracking-wide capitalize">{formattedDate}</span>
          <div className="hidden sm:block w-full h-[1px] bg-white/5 my-1" />
          <span className="text-[12px] md:text-[13px] text-[#10B981] font-bold">{formattedTime}</span>
        </div>
      </div>
      
      {/* 2. Resumo Executivo da IA */}
      <div className="flex items-start gap-3 mt-1 w-full max-w-[900px] p-4 rounded-2xl bg-[#10B981]/5 border border-[#10B981]/10">
        <Brain className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
        <p className="text-[15px] text-[#E2E8F0] font-medium tracking-wide leading-relaxed flex-1">
          {status === 'empty' ? 
            'Seu Assistente está pronto. Envie sua primeira mensagem pelo WhatsApp para começar a organizar sua vida.' : 
            'Hoje sua agenda está equilibrada e seu fluxo financeiro continua saudável.'}
        </p>
      </div>

      {/* 3. Executive Summary Bar (Pills) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 w-[calc(100%+2rem)] sm:w-full">
        
        {/* Saldo */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all group shrink-0 min-w-[140px]">
          <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <DollarSign className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-wider">Saldo</span>
            <span className="text-[14px] font-bold text-white">{formatCurrency(financial.balance)}</span>
          </div>
        </button>

        {/* Entrou Hoje */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all group shrink-0 min-w-[140px]">
          <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ArrowUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-wider">Entrou Hoje</span>
            <span className="text-[14px] font-bold text-[#10B981]">{formatCurrency(financial.income_today)}</span>
          </div>
        </button>

        {/* Saiu Hoje */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all group shrink-0 min-w-[140px]">
          <div className="w-8 h-8 rounded-full bg-[#ef4444]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ArrowDown className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-wider">Saiu Hoje</span>
            <span className="text-[14px] font-bold text-[#ef4444]">{formatCurrency(financial.expense_today)}</span>
          </div>
        </button>

        {/* Agenda */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all group shrink-0 min-w-[140px]">
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-wider">Hoje</span>
            <span className="text-[14px] font-bold text-white">{agendaCount} comps.</span>
          </div>
        </button>

        {/* WhatsApp */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all group shrink-0 min-w-[140px]">
          <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-wider">WhatsApp</span>
            <span className="text-[14px] font-bold text-white">{msgCount} msgs</span>
          </div>
        </button>

        {/* Documentos */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all group shrink-0 min-w-[140px]">
          <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-wider">Pendências</span>
            <span className="text-[14px] font-bold text-white">0 docs</span>
          </div>
        </button>

      </div>

    </header>
  );
}
