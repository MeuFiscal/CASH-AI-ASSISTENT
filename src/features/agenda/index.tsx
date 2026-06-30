import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Calendar, Clock, MapPin, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CalendarSelector } from './components/CalendarSelector';

export function Agenda() {
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [eventsSelected, setEventsSelected] = useState<any[]>([]);
  const [eventsNext, setEventsNext] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  
  // Set of dates in YYYY-MM-DD that have events
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());

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

      // --- Buscar eventos para preencher as bolinhas azuis do calendário (últimos 3 meses até próximos 3 meses) ---
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const threeMonthsAhead = new Date();
      threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);

      const { data: allEvents } = await supabase
        .from('calendar_events')
        .select('start_time')
        .eq('workspace_id', ws.workspace_id)
        .gte('start_time', threeMonthsAgo.toISOString())
        .lte('start_time', threeMonthsAhead.toISOString());

      if (allEvents) {
        const datesSet = new Set<string>();
        allEvents.forEach(evt => {
          const d = new Date(evt.start_time);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          datesSet.add(dateStr);
        });
        setActiveDates(datesSet);
      }

      // --- Buscar eventos do Dia Selecionado e Dia Seguinte ---
      const startOfSelected = new Date(selectedDate);
      startOfSelected.setHours(0, 0, 0, 0);
      
      const endOfSelected = new Date(startOfSelected);
      endOfSelected.setHours(23, 59, 59, 999);

      const startOfNext = new Date(startOfSelected);
      startOfNext.setDate(startOfNext.getDate() + 1);
      
      const endOfNext = new Date(startOfNext);
      endOfNext.setHours(23, 59, 59, 999);

      // Eventos Dia Selecionado
      const { data: evtsSelected } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .gte('start_time', startOfSelected.toISOString())
        .lte('start_time', endOfSelected.toISOString())
        .order('start_time', { ascending: true });
        
      if (evtsSelected) setEventsSelected(evtsSelected);

      // Eventos Dia Seguinte
      const { data: evtsNext } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .gte('start_time', startOfNext.toISOString())
        .lte('start_time', endOfNext.toISOString())
        .order('start_time', { ascending: true });
        
      if (evtsNext) setEventsNext(evtsNext);

      // --- Tarefas (Independente de data para simplificar) ---
      const { data: tsks } = await supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .order('created_at', { ascending: false });

      if (tsks) setTasks(tsks);
    }
    
    loadAgenda();
  }, [user, selectedDate]);

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };
  
  const formatNextDateLabel = (date: Date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return formatDateLabel(next);
  };

  const renderEventList = (eventsList: any[]) => {
    if (eventsList.length === 0) {
      return <p className="text-[#A8B3CF] text-[15px] italic ml-4">Nenhum compromisso programado.</p>;
    }
    
    return (
      <div className="flex flex-col gap-6 relative ml-4">
        <div className="absolute top-2 bottom-0 left-[3px] w-[1px] bg-gradient-to-b from-white/10 to-transparent" />
        {eventsList.map((event, idx) => {
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
    );
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader 
          icon={Calendar}
          title="Agenda Inteligente"
          subtitle="Interpretação e organização do seu tempo baseada em IA."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lado Esquerdo: Calendário */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <CalendarSelector 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
              activeDates={activeDates} 
            />

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
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PageSection>
          </div>

          {/* Lado Direito: Timeline de 2 dias */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            <PageSection title={`Agenda (${formatDateLabel(selectedDate)})`}>
              {renderEventList(eventsSelected)}
            </PageSection>

            <PageSection title={`Agenda (${formatNextDateLabel(selectedDate)})`}>
              {renderEventList(eventsNext)}
            </PageSection>

          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
