import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Calendar, Clock, MapPin, CheckCircle, Circle } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function Agenda() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function loadAgenda() {
      if (!user?.id) return;
      const { data: ws } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!ws?.workspace_id) return;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: calEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .gte('start_time', todayStart.toISOString())
        .order('start_time', { ascending: true });

      if (calEvents) setEvents(calEvents);

      const { data: tsks } = await supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .order('created_at', { ascending: false });

      if (tsks) setTasks(tsks);
    }
    loadAgenda();
  }, [user]);

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader 
          icon={Calendar}
          title="Agenda Inteligente"
          subtitle="Interpretação e organização do seu tempo baseada em IA."
        />

        {events.length === 0 && tasks.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20">
              <Calendar className="w-10 h-10 text-[#8B5CF6] opacity-80" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sua agenda está livre!</h2>
            <p className="text-[#A8B3CF] w-full max-w-[500px] mx-auto min-w-[300px] mb-8">
              Aproveite o tempo extra ou comece a planejar sua semana. A IA pode organizar seus compromissos para você.
            </p>
            <button className="px-6 py-2.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              Criar primeiro compromisso
            </button>
          </div>
        ) : (
          <>
            <PageSection title="Resumo Executivo">
        <div className="p-6 md:p-8 rounded-3xl bg-[#181C28]/80 border border-white/5 backdrop-blur-xl mb-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-50" />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <span className="text-[12px] font-bold text-[#7B879D] uppercase tracking-widest">Minha Análise</span>
          </div>
          
          <p className="text-[#E2E8F0] text-[16px] md:text-[18px] leading-relaxed font-medium">
            Você tem {events.length} evento{events.length !== 1 ? 's' : ''} programado{events.length !== 1 ? 's' : ''} para os próximos dias e {tasks.filter(t => t.status !== 'completed').length} tarefa{tasks.filter(t => t.status !== 'completed').length !== 1 ? 's' : ''} pendente{tasks.filter(t => t.status !== 'completed').length !== 1 ? 's' : ''}.<br />
            Mantenha o foco nos itens prioritários para garantir sua produtividade.
          </p>
        </div>
        </PageSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <PageSection title="Timeline do Dia">
            <div className="flex flex-col gap-6 pl-4">
              {events.length === 0 ? (
                <p className="text-[#A8B3CF] text-[15px]">Você não tem eventos programados no momento.</p>
              ) : (
                <div className="flex flex-col gap-6 relative">
                  <div className="absolute top-2 bottom-0 left-[3px] w-[1px] bg-gradient-to-b from-white/10 to-transparent" />
                  
                  {events.map((event, idx) => {
                    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
                    const color = colors[idx % colors.length];
                    const startTime = new Date(event.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div key={event.id} className="flex items-start gap-6 relative animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                        <div className="w-2 h-2 rounded-full border-2 mt-2 shrink-0 z-10" style={{ backgroundColor: '#181C28', borderColor: color }} />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors gap-2">
                          <div>
                            <h4 className="text-[15px] font-semibold text-white tracking-wide">{event.title}</h4>
                            {event.description && <p className="text-[13px] text-[#A8B3CF] mt-1">{event.description}</p>}
                            {event.location && (
                              <p className="text-[12px] text-[#A8B3CF] mt-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {event.location}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full w-fit" style={{ color: color, backgroundColor: `${color}1A` }}>
                            <Clock className="w-4 h-4" />
                            <span className="text-[13px] font-bold">{startTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </PageSection>

          <PageSection title="Lista de Tarefas">
            <div className="flex flex-col gap-4">
              {tasks.length === 0 ? (
                <p className="text-[#A8B3CF] text-[15px]">Você não tem tarefas registradas.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-start justify-between gap-4 p-4 bg-[#181C28]/60 border border-white/5 rounded-2xl backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleTaskStatus(task.id, task.status)} className="mt-0.5 text-[#A8B3CF] hover:text-[#10B981] transition-colors">
                        {task.status === 'completed' ? <CheckCircle className="w-5 h-5 text-[#10B981]" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-[15px] font-medium transition-colors ${task.status === 'completed' ? 'text-[#A8B3CF] line-through' : 'text-white'}`}>
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-[#A8B3CF] text-[13px] mt-1">{task.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PageSection>

        </div>
          </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
