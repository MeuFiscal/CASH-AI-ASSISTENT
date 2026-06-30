import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { BarChart2, TrendingUp, Sparkles, Clock, Target, Lightbulb } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

function getInsightStyle(type: string) {
  switch (type) {
    case 'recommendation': return { icon: Sparkles, color: 'text-[#F59E0B]', bg: 'from-transparent via-[#F59E0B] to-transparent', border: 'hover:border-[#F59E0B]/30' };
    case 'warning': return { icon: Target, color: 'text-[#EF4444]', bg: 'from-transparent via-[#EF4444] to-transparent', border: 'hover:border-[#EF4444]/30' };
    case 'priority': return { icon: TrendingUp, color: 'text-[#10B981]', bg: 'from-transparent via-[#10B981] to-transparent', border: 'hover:border-[#10B981]/30' };
    case 'summary':
    default: return { icon: Clock, color: 'text-[#8B5CF6]', bg: 'from-transparent via-[#8B5CF6] to-transparent', border: 'hover:border-[#8B5CF6]/30' };
  }
}

export function Insights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      if (!user?.id) return;
      const { data: ws } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!ws?.workspace_id) return;

      const { data: ins } = await supabase
        .from('insights')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .order('created_at', { ascending: false });

      setInsights(ins || []);
      setLoading(false);
    }
    loadInsights();
  }, [user]);

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader 
          icon={BarChart2}
          title="Insights"
          subtitle="Interpretações e descobertas da IA sobre sua vida."
        />

        {!loading && insights.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20">
              <Lightbulb className="w-10 h-10 text-[#8B5CF6] opacity-80" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">A IA ainda está aprendendo sobre sua rotina.</h2>
            <p className="text-[#A8B3CF] w-full max-w-md mx-auto min-w-[300px]">Converse mais com o assistente, registre despesas e compromissos para gerar insights personalizados sobre você.</p>
          </div>
        ) : (
          <PageSection title="Análises da IA">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {insights.map((insight) => {
                const style = getInsightStyle(insight.type);
                return (
                  <div key={insight.id} className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#181C28]/80 to-transparent border border-white/5 backdrop-blur-xl relative overflow-hidden group transition-colors ${style.border}`}>
                    <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r ${style.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="flex items-center gap-3 mb-4">
                      <style.icon className={`w-5 h-5 ${style.color}`} />
                      <h3 className="text-[14px] font-bold text-[#E2E8F0] tracking-wide">{insight.title}</h3>
                    </div>
                    <p className="text-[#A8B3CF] text-[15px] leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </PageSection>
        )}

      </PageContainer>
    </DashboardLayout>
  );
}
