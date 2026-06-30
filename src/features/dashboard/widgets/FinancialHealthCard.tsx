import { PiggyBank, Wallet } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { useDashboard } from '../hooks/useDashboard';

export function FinancialHealthCard() {
  const { data, status } = useDashboard();

  if (status === 'loading') {
    return (
      <DashboardCard className="p-0 bg-[#181C28]/50 h-[300px] flex items-center justify-center border-white/5">
        <div className="flex flex-col gap-6 w-full px-8 animate-pulse">
          <div className="w-24 h-3 bg-white/5 rounded-full" />
          <div className="w-48 h-8 bg-white/10 rounded-full" />
          <div className="flex gap-10 mt-2">
            <div className="w-20 h-8 bg-white/5 rounded-md" />
            <div className="w-20 h-8 bg-white/5 rounded-md" />
          </div>
        </div>
      </DashboardCard>
    );
  }

  const financial = data?.financial;
  const isActuallyEmpty = financial && financial.balance === 0 && financial.income_today === 0 && financial.expense_today === 0;

  if (status === 'empty' || isActuallyEmpty) {
    return (
      <DashboardCard className="p-0 border-[#10B981]/20 bg-gradient-to-br from-[#181C28] to-[#0B1221] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-full blur-[50px]" />
        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-[#10B981]" />
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-2">Ainda não há movimentações</h3>
          <p className="text-[14px] text-[#A8B3CF] leading-relaxed max-w-[280px]">
            Experimente me enviar uma mensagem no WhatsApp:<br/><br/>
            <span className="text-white italic">"Gastei R$ 35 de combustível"</span>
            <br/><br/>
            Organizarei tudo automaticamente.
          </p>
        </div>
      </DashboardCard>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  return (
    <DashboardCard className="p-0 flex flex-col justify-between group h-auto">
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        
        <div className="flex flex-col mb-4">
          <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-widest mb-1">Saldo Atual</span>
          <span className="text-3xl md:text-4xl font-black text-white tracking-tight">{formatCurrency(financial?.balance || 0)}</span>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-widest mb-1">Entrou Hoje</span>
            <span className="text-[15px] font-bold text-[#10B981]">+{formatCurrency(financial?.income_today || 0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#A8B3CF] uppercase tracking-widest mb-1">Saiu Hoje</span>
            <span className="text-[15px] font-bold text-[#ef4444]">-{formatCurrency(financial?.expense_today || 0)}</span>
          </div>
        </div>

        {/* Removed mock transactions since RPC doesn't deliver them yet */}

      </div>
      
      {/* Footer Interpretation */}
      <div className="px-5 py-4 sm:px-6 bg-[#10B981]/[0.02] border-t border-[#10B981]/10 flex items-start gap-3 mt-auto">
        <PiggyBank className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#E2E8F0] font-medium tracking-wide">
          Sua saúde financeira está sendo analisada.
        </p>
      </div>
    </DashboardCard>
  );
}
