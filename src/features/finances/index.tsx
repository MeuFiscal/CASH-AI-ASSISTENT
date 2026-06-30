import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DollarSign, ArrowUpRight, ArrowDownRight, Target, Brain, PieChart, ArrowDown, ArrowUp } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function Finances() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'in' | 'out'>('out');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    async function loadFinances() {
      if (!user?.id) return;
      const { data: ws } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!ws?.workspace_id) return;

      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .order('date', { ascending: false });

      if (txs) {
        setTransactions(txs);
        let inc = 0;
        let exp = 0;
        txs.forEach(t => {
          if (t.type === 'income') inc += Number(t.amount);
          else exp += Number(t.amount);
        });
        setIncome(inc);
        setExpense(exp);
        setBalance(inc - exp);
      }
    }
    loadFinances();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');
  const displayList = activeTab === 'in' ? incomes : expenses;

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader 
          icon={DollarSign}
          title="Finanças"
          subtitle="Sua saúde financeira atualizada em tempo real."
        />

        {transactions.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-6 border border-[#10B981]/20">
              <DollarSign className="w-10 h-10 text-[#10B981] opacity-80" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Bem-vindo ao seu controle financeiro</h2>
            <p className="text-[#A8B3CF] w-full max-w-[500px] mx-auto min-w-[300px] mb-8">
              Sua jornada para uma vida financeira inteligente começa aqui. Adicione sua primeira despesa ou receita para ver os relatórios e análises da IA.
            </p>
            <button className="px-6 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Adicionar Transação Manual
            </button>
          </div>
        ) : (
          <>
            <PageSection title="Análise Executiva">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/5 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-50" />
          
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-[#10B981]" />
            <span className="text-[13px] font-bold text-white tracking-wide">Saldo Atual</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed mb-4">
            Seu saldo total é de {formatCurrency(balance)}.
          </h2>
          <p className="text-[#A8B3CF] text-[16px] max-w-[800px] leading-relaxed">
            Você teve um total de {formatCurrency(income)} em entradas e {formatCurrency(expense)} em saídas registradas no sistema.
          </p>
        </div>
        </PageSection>

        <PageSection title="Métricas e Distribuição">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Fluxo de Caixa */}
          <div className="col-span-1 md:col-span-2 p-6 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl flex flex-col group hover:bg-[#181C28]/80 transition-all">
            <div className="flex items-center gap-2 mb-6 text-[#A8B3CF]">
              <PieChart className="w-5 h-5" />
              <h3 className="font-semibold text-white tracking-wide">Fluxo de Caixa</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-auto">
              <div>
                <p className="text-[13px] text-[#A8B3CF] mb-1 flex items-center gap-1">
                  Receitas <ArrowUpRight className="w-3 h-3 text-[#10B981]" />
                </p>
                <p className="text-2xl font-bold text-white">{formatCurrency(income)}</p>
              </div>
              <div>
                <p className="text-[13px] text-[#A8B3CF] mb-1 flex items-center gap-1">
                  Despesas <ArrowDownRight className="w-3 h-3 text-[#ef4444]" />
                </p>
                <p className="text-2xl font-bold text-white">{formatCurrency(expense)}</p>
              </div>
            </div>
          </div>

          {/* Investimentos / Metas */}
          <div className="col-span-1 p-6 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl flex flex-col group hover:bg-[#181C28]/80 transition-all">
            <div className="flex items-center gap-2 mb-6 text-[#A8B3CF]">
              <Target className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="font-semibold text-white tracking-wide">Saúde Geral</h3>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] text-white font-medium">Balanço</span>
                <span className="text-[14px] text-[#3B82F6] font-bold">
                  {income > 0 ? Math.round((balance / income) * 100) : 0}% Livre
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${income > 0 ? Math.max(0, Math.round((balance / income) * 100)) : 0}%` }} />
              </div>
            </div>
          </div>

        </div>
        </PageSection>

        <PageSection title="Movimentações Inteligentes">
          <div className="flex flex-col gap-6">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-[#181C28]/60 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('in')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all ${
                  activeTab === 'in' 
                    ? 'bg-[#10B981]/20 text-[#10B981] shadow-lg shadow-[#10B981]/10' 
                    : 'text-[#A8B3CF] hover:text-white'
                }`}
              >
                <ArrowUp className="w-4 h-4" /> Entradas
              </button>
              <button
                onClick={() => setActiveTab('out')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all ${
                  activeTab === 'out' 
                    ? 'bg-[#ef4444]/20 text-[#ef4444] shadow-lg shadow-[#ef4444]/10' 
                    : 'text-[#A8B3CF] hover:text-white'
                }`}
              >
                <ArrowDown className="w-4 h-4" /> Saídas
              </button>
            </div>

            {/* Content */}
            <div className="bg-[#181C28]/60 border border-white/5 rounded-3xl backdrop-blur-xl p-6 sm:p-8 flex flex-col gap-8 min-h-[300px]">
              
              <div>
                <h4 className="text-[14px] font-bold text-white tracking-widest uppercase mb-4 opacity-80">
                  Transações ({displayList.length})
                </h4>
                <div className="flex flex-col gap-3">
                  {displayList.length === 0 ? (
                    <p className="text-[#A8B3CF] text-[14px]">Nenhuma transação encontrada.</p>
                  ) : (
                    displayList.map(tx => (
                      <div key={tx.id} className="flex items-start sm:items-center justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group flex-col sm:flex-row">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'income' ? 'bg-[#10B981]/10' : 'bg-[#ef4444]/10'}`}>
                            {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5 text-[#10B981]" /> : <DollarSign className="w-5 h-5 text-[#ef4444]" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-[15px]">{tx.description}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[#A8B3CF] text-[13px]">{new Date(tx.date).toLocaleDateString()}</span>
                              {tx.category && (
                                <span className="text-[#3B82F6] text-[12px] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full">{tx.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <span className={`font-bold text-[16px] ${tx.type === 'income' ? 'text-[#10B981]' : 'text-[#ef4444]'}`}>
                            {tx.type === 'income' ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                          </span>
                          <span className={`text-[12px] font-semibold mt-0.5 ${tx.status === 'paid' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                            {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
              </div>
            </PageSection>
          </>
        )}

      </PageContainer>
    </DashboardLayout>
  );
}
