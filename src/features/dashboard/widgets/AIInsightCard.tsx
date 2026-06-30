import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';

const INSIGHTS = [
  "Você economizou 15% a mais que na semana passada. Excelente ritmo.",
  "Sua agenda para amanhã está perfeitamente equilibrada, sem sobrecargas.",
  "Existem 3 documentos na pasta 'Financeiro' aguardando sua revisão.",
  "Notei que você costuma registrar despesas após as 18h. Posso lembrar você.",
  "Nenhum compromisso conflitante foi detectado para os próximos 7 dias.",
  "Seus gastos com alimentação caíram. O planejamento está funcionando perfeitamente."
];

export function AIInsightCard() {
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const randomMsg = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
    setInsight(randomMsg);
  }, []);

  return (
    <DashboardCard className="p-0 !pb-0 h-full flex flex-col justify-center bg-gradient-to-br from-[#8B5CF6]/5 to-transparent border-[#8B5CF6]/10 hover:border-[#8B5CF6]/20 transition-colors">
      <div className="flex items-start gap-5 p-6 sm:p-8 w-full">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1.5 pt-0.5">
          <p className="text-[11px] font-black text-[#8B5CF6] uppercase tracking-widest">Insight da IA</p>
          <p className="text-[15px] sm:text-[17px] font-medium text-white leading-relaxed tracking-wide">
            {insight}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
