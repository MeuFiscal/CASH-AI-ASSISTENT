
import { Activity, Database, Zap, HardDrive } from 'lucide-react';

interface ServiceHealth {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  lastCheck: string;
  icon: React.ElementType;
}

export function SystemHealthPanel({ loading }: { loading: boolean }) {
  const services: ServiceHealth[] = [
    { name: 'Supabase', status: 'online', latency: 45, lastCheck: 'agora', icon: Database },
    { name: 'OpenAI API', status: 'online', latency: 248, lastCheck: 'agora', icon: BrainCircuit },
    { name: 'WhatsApp API', status: 'online', latency: 120, lastCheck: 'agora', icon: MessageCircle },
    { name: 'Stripe', status: 'online', latency: 85, lastCheck: 'agora', icon: CreditCard },
    { name: 'Vercel Edge', status: 'online', latency: 32, lastCheck: 'agora', icon: Zap },
    { name: 'Storage', status: 'online', latency: 55, lastCheck: 'agora', icon: HardDrive },
  ];

  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-medium">Saúde do Sistema</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-sm text-[#A8B3CF]">Verificando serviços...</div>
        ) : (
          services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0D14]/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon className="w-4 h-4 text-[#A8B3CF]" />
                    <span className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-[#0A0D14] ${service.status === 'online' ? 'bg-emerald-500' : service.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{service.name}</div>
                    <div className="text-[10px] text-[#A8B3CF] uppercase tracking-wider">{service.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{service.latency} ms</div>
                  <div className="text-[10px] text-[#A8B3CF]">Última verif: {service.lastCheck}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Temporary imports since lucide-react doesn't export them all in the snippet
import { BrainCircuit, MessageCircle, CreditCard } from 'lucide-react';
