import { Clock, UserPlus, CreditCard, AlertCircle, PlayCircle, Zap } from 'lucide-react';

interface EventLog {
  id: string;
  type: 'user_joined' | 'payment' | 'error' | 'webhook' | 'workspace_created';
  title: string;
  description: string;
  date: string;
}

export function RecentEventsTimeline({ events, loading }: { events: EventLog[], loading: boolean }) {
  const getTypeConfig = (type: EventLog['type']) => {
    switch (type) {
      case 'user_joined': return { icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-400/10' };
      case 'payment': return { icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
      case 'error': return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' };
      case 'webhook': return { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10' };
      case 'workspace_created': return { icon: PlayCircle, color: 'text-orange-400', bg: 'bg-orange-400/10' };
      case 'workspace_created': return { icon: PlayCircle, color: 'text-orange-400', bg: 'bg-orange-400/10' };
      default: return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10' };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500 h-full">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#A8B3CF]" />
        <h3 className="text-white font-medium">Eventos Recentes</h3>
      </div>

      <div className="flex flex-col mt-2 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent pr-2 overflow-y-auto h-[350px] custom-scrollbar">
        {loading ? (
          <div className="text-sm text-[#A8B3CF] text-center w-full mt-4">Carregando timeline...</div>
        ) : events?.length === 0 ? (
          <div className="text-sm text-[#A8B3CF] text-center w-full mt-4">Nenhum evento recente</div>
        ) : (
          events?.map((event) => {
            const config = getTypeConfig(event.type);
            const Icon = config.icon;
            return (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6 last:mb-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border border-white/10 ${config.bg} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 md:ml-auto md:mr-auto`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-xl bg-[#0A0D14]/50 border border-white/5 hover:bg-[#181C28] transition-colors ml-4 md:ml-0 shadow-sm">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-medium text-white text-sm line-clamp-1 truncate">{event.title}</span>
                    <time className="text-[10px] text-[#A8B3CF] bg-white/5 px-2 py-0.5 rounded-full shrink-0">{formatDate(event.date)}</time>
                  </div>
                  <div className="text-xs text-[#A8B3CF] line-clamp-2">{event.description}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
