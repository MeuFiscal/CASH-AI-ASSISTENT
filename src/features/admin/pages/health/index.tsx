import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Database, Zap, HardDrive, Smartphone, BrainCircuit, Code } from 'lucide-react';

interface SystemHealth {
  supabase: string;
  realtime: string;
  storage: string;
  whatsapp: string;
  openai: string;
  edge_functions: string;
  last_errors: any[];
}

export function AdminHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealth() {
      const { data, error } = await supabase.rpc('admin_get_system_health');
      if (!error && data) {
        setHealth(data as SystemHealth);
      }
      setLoading(false);
    }
    loadHealth();
  }, []);

  const StatusIndicator = ({ status }: { status?: string }) => {
    if (status === 'operational') {
      return (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Operacional</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
        <span className="text-red-400 text-sm font-medium">Forte Instabilidade</span>
      </div>
    );
  };

  const systems = [
    { name: 'Supabase DB', icon: Database, key: 'supabase' },
    { name: 'Realtime', icon: Zap, key: 'realtime' },
    { name: 'Storage', icon: HardDrive, key: 'storage' },
    { name: 'WhatsApp API', icon: Smartphone, key: 'whatsapp' },
    { name: 'OpenAI API', icon: BrainCircuit, key: 'openai' },
    { name: 'Edge Functions', icon: Code, key: 'edge_functions' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Saúde do Sistema</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Monitoramento de serviços, integrações e estabilidade da plataforma.</p>
        </div>
        
        {loading ? (
          <div className="w-full h-32 border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <span className="text-[#A8B3CF] font-medium">Verificando sistemas...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systems.map((sys) => {
              const Icon = sys.icon;
              const status = health ? (health as any)[sys.key] : 'unknown';
              
              return (
                <div key={sys.key} className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Icon className="w-5 h-5 text-white/70" />
                      </div>
                      <span className="text-white font-medium">{sys.name}</span>
                    </div>
                    <StatusIndicator status={status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
