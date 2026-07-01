import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  X, Building2, Zap, HardDrive
} from 'lucide-react';

interface UserDrawerProps {
  userId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function UserDrawer({ userId, onClose }: UserDrawerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'permissions'>('profile');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: res, error } = await supabase.rpc('admin_get_user', { p_user_id: userId });
      if (!error && res) setData(res);
      setLoading(false);
    }
    loadData();
  }, [userId]);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen w-full max-w-lg bg-[#11131A] border-l border-white/5 z-[9999] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Perfil do Usuário</h2>
          <button onClick={onClose} className="p-2 text-[#A8B3CF] hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : !data ? (
          <div className="flex-1 p-6 text-center text-[#A8B3CF]">Erro ao carregar dados.</div>
        ) : (
          <>
            {/* User Info Header */}
            <div className="p-6 bg-[#181C28]/60 border-b border-white/5 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white text-2xl font-medium uppercase">
                {data.profile?.name?.charAt(0) || '?'}
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white">{data.profile?.name}</h3>
                <span className="text-sm text-[#A8B3CF]">{data.profile?.email}</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${
                    data.profile?.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {data.profile?.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-white/40 bg-white/5">
                    {data.profile?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-6 pt-4 gap-6">
              <button onClick={() => setActiveTab('profile')} className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'profile' ? 'border-blue-500 text-white' : 'border-transparent text-[#A8B3CF] hover:text-white'}`}>Visão Geral</button>
              <button onClick={() => setActiveTab('permissions')} className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'permissions' ? 'border-blue-500 text-white' : 'border-transparent text-[#A8B3CF] hover:text-white'}`}>Permissões</button>
              <button onClick={() => setActiveTab('timeline')} className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'timeline' ? 'border-blue-500 text-white' : 'border-transparent text-[#A8B3CF] hover:text-white'}`}>Timeline</button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
              
              {activeTab === 'profile' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#181C28]/60 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                      <span className="text-xs text-[#A8B3CF]">Último Login</span>
                      <span className="text-sm text-white font-medium">{data.profile?.last_login_at ? format(new Date(data.profile.last_login_at), "dd/MM/yyyy HH:mm", {locale: ptBR}) : 'Nunca'}</span>
                    </div>
                    <div className="bg-[#181C28]/60 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                      <span className="text-xs text-[#A8B3CF]">Data de Cadastro</span>
                      <span className="text-sm text-white font-medium">{data.profile?.created_at ? format(new Date(data.profile.created_at), "dd/MM/yyyy", {locale: ptBR}) : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider">Estatísticas de Uso</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#181C28]/60 rounded-xl p-4 border border-white/5 flex gap-3 items-center">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-[#A8B3CF]">Tokens OpenAI</span>
                          <span className="text-lg font-bold text-white">{data.usage?.ai_tokens || 0}</span>
                        </div>
                      </div>
                      <div className="bg-[#181C28]/60 rounded-xl p-4 border border-white/5 flex gap-3 items-center">
                        <HardDrive className="w-5 h-5 text-blue-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-[#A8B3CF]">Storage</span>
                          <span className="text-lg font-bold text-white">{Math.round((data.usage?.storage_bytes || 0) / 1024 / 1024)} MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider">Workspace Principal</h4>
                    {data.workspaces?.length > 0 ? (
                      <div className="bg-[#181C28]/60 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-white/40" />
                          <div className="flex flex-col">
                            <span className="text-sm text-white font-medium">{data.workspaces[0].name}</span>
                            <span className="text-xs text-[#A8B3CF]">Role: {data.workspaces[0].role}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-[#A8B3CF]">Sem workspace associado.</span>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'permissions' && (
                <div className="space-y-4">
                  {Object.entries(data.profile?.permissions || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-sm text-white">{key.replace('can_', 'Pode ').replace(/_/g, ' ')}</span>
                      <span className={`w-3 h-3 rounded-full ${value ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500/20 border border-red-500/50'}`} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="text-sm text-[#A8B3CF] text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  Timeline de Auditoria será populada via Realtime Events. (Work in Progress)
                </div>
              )}
            </div>

            {/* Sticky Actions */}
            <div className="p-6 border-t border-white/5 bg-[#11131A] flex gap-3">
              <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10">
                Editar Dados
              </button>
              {data.profile?.status === 'active' ? (
                <button className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-medium transition-colors border border-red-500/20">
                  Bloquear
                </button>
              ) : (
                <button className="flex-1 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-sm font-medium transition-colors border border-green-500/20">
                  Desbloquear
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}
