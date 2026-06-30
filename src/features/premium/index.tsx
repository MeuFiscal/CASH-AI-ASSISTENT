import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Crown, Sparkles, ArrowRight, CheckCircle2, Zap, Calendar, History } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  current_period_end: string;
}

export function Premium() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      if (user?.id) {
        // Obter workspace
        const { data: ws } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (ws?.workspace_id) {
          // Buscar subscription
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('workspace_id', ws.workspace_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (sub && sub.status === 'active') {
            setSubscription(sub as Subscription);
          }
        }
      }
      setLoading(false);
    }
    loadSubscription();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  const isPremium = !!subscription;

  return (
    <DashboardLayout>
      <PageContainer>
        
        {/* Header Baseado no Status */}
        <section className="text-center flex flex-col items-center mt-8">
          <div className="p-4 bg-[#F59E0B]/10 rounded-full border border-[#F59E0B]/20 mb-8 inline-flex">
            <Crown className="w-8 h-8 text-[#F59E0B]" />
          </div>
          
          {isPremium ? (
            <>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Você é um membro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FCD34D]">Premium</span>
              </h1>
              <p className="text-[#A8B3CF] text-lg max-w-[600px] mb-8">
                Seu plano está ativo e seu Assistente Executivo está 100% operacional.
              </p>
              
              <div className="flex flex-col gap-4 text-left w-full max-w-md bg-[#181C28]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-[#A8B3CF] text-sm">Plano Atual</span>
                  <span className="text-white font-bold uppercase tracking-wider">{subscription.plan_name || 'Premium'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-[#A8B3CF] text-sm">Status</span>
                  <span className="text-[#10B981] font-bold">Ativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A8B3CF] text-sm">Renovação</span>
                  <span className="text-white">{subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : 'Não informada'}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Desbloqueie o seu<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FCD34D]">
                  Assistente Executivo
                </span>
              </h1>
              <p className="text-[#A8B3CF] text-lg md:text-xl max-w-[800px] leading-relaxed mb-6">
                Você está atualmente no <span className="text-white font-bold">Plano Gratuito</span>.
                Deixe o Cash AI assumir o controle total das suas finanças e agenda.
              </p>
              <button 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-bold text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center gap-3"
                onClick={() => alert('Integração com gateway (Asaas) em breve!')}
              >
                Fazer Upgrade Agora
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
        </section>

        {!isPremium && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative mt-16">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#181C28] border border-white/10 flex items-center justify-center z-10 hidden md:flex">
              <ArrowRight className="w-5 h-5 text-[#A8B3CF]" />
            </div>

            <div className="p-8 md:p-10 rounded-[40px] bg-[#181C28]/40 border border-white/5 flex flex-col gap-6 opacity-70">
              <h3 className="text-[13px] font-bold text-[#A8B3CF] tracking-widest uppercase">Como é hoje</h3>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-3 text-[#A8B3CF]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-2 shrink-0" />
                  <span className="text-[16px] leading-relaxed">Você precisa abrir o app para lançar despesas.</span>
                </li>
                <li className="flex gap-3 text-[#A8B3CF]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-2 shrink-0" />
                  <span className="text-[16px] leading-relaxed">Você precisa analisar gráficos para entender seu mês.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 md:p-10 rounded-[40px] bg-gradient-to-br from-[#F59E0B]/10 to-[#181C28]/80 border border-[#F59E0B]/30 flex flex-col gap-6 shadow-[0_0_50px_rgba(245,158,11,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <Sparkles className="w-24 h-24 text-[#F59E0B]/10" />
              </div>
              <h3 className="text-[13px] font-bold text-[#F59E0B] tracking-widest uppercase relative z-10">Com Premium</h3>
              <ul className="flex flex-col gap-4 relative z-10">
                <li className="flex gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-[#F59E0B] shrink-0" />
                  <span className="text-[16px] font-medium leading-relaxed">Manda áudio no WhatsApp e a IA resolve tudo.</span>
                </li>
                <li className="flex gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-[#F59E0B] shrink-0" />
                  <span className="text-[16px] font-medium leading-relaxed">Recebe resumos diários interpretados da sua vida.</span>
                </li>
              </ul>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl flex flex-col items-center text-center gap-4">
            <Zap className="w-8 h-8 text-[#3B82F6]" />
            <h4 className="text-lg font-bold text-white">Velocidade Máxima</h4>
            <p className="text-[#A8B3CF] text-[14px] leading-relaxed">Prioridade na fila de processamento da IA para respostas instantâneas.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl flex flex-col items-center text-center gap-4">
            <History className="w-8 h-8 text-[#F59E0B]" />
            <h4 className="text-lg font-bold text-white">Histórico Infinito</h4>
            <p className="text-[#A8B3CF] text-[14px] leading-relaxed">Acesso total ao histórico de conversas e transações desde o dia um.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl flex flex-col items-center text-center gap-4">
            <Calendar className="w-8 h-8 text-[#10B981]" />
            <h4 className="text-lg font-bold text-white">Google Agenda</h4>
            <p className="text-[#A8B3CF] text-[14px] leading-relaxed">Integração bidirecional com sua agenda e contatos.</p>
          </div>
        </section>

      </PageContainer>
    </DashboardLayout>
  );
}
