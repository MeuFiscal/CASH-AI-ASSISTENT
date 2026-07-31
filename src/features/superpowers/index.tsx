import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Database, Mail, RefreshCw, Link2, Unplug, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const services = [
  { icon: Calendar, name: 'Google Agenda', key: 'calendar', color: 'text-blue-400', text: 'Busca seus eventos e os organiza na agenda do Cash AI.' },
  { icon: Database, name: 'Google Drive', key: 'drive', color: 'text-emerald-400', text: 'Importa a lista de documentos autorizados para busca no painel.' },
  { icon: Mail, name: 'Gmail', key: 'gmail', color: 'text-red-400', text: 'Busca os e-mails recentes em modo somente leitura.' },
];

export function Superpowers() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [integration, setIntegration] = useState<{ account_email?: string; updated_at?: string } | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadStatus = useCallback(async () => {
    if (!user?.id) return;
    const { data: member } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).limit(1).maybeSingle();
    if (!member) return;
    const { data } = await supabase.from('integrations').select('account_email, updated_at').eq('workspace_id', member.workspace_id).eq('provider', 'google').maybeSingle();
    setIntegration(data);
  }, [user]);

  useEffect(() => { loadStatus(); }, [loadStatus]);
  useEffect(() => {
    if (params.get('google') === 'connected') { setMessage('Conta Google conectada. Sincronizando os dados...'); setParams({}, { replace: true }); loadStatus().then(() => sync()); }
    if (params.get('google') === 'error') { setMessage(params.get('message') || 'Não foi possível conectar o Google.'); setParams({}, { replace: true }); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    setLoading(true); setMessage('');
    const { data, error } = await supabase.functions.invoke('google-oauth-start');
    if (error || !data?.url) { setMessage(error?.message || data?.error || 'Não foi possível iniciar a conexão.'); setLoading(false); return; }
    window.location.href = data.url;
  };

  const sync = async () => {
    setLoading(true); setMessage('Sincronizando Agenda, Drive e Gmail...');
    const { data, error } = await supabase.functions.invoke('google-sync', { body: { action: 'sync' } });
    setLoading(false);
    if (error || data?.error) { setMessage(data?.error || error?.message || 'Falha na sincronização.'); return; }
    setCounts(data); setMessage('Sincronização concluída com sucesso.'); await loadStatus();
  };

  const disconnect = async () => {
    if (!confirm('Desconectar a conta Google? Os dados já importados permanecerão no Cash AI.')) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('google-sync', { body: { action: 'disconnect' } });
    setLoading(false);
    if (error || data?.error) { setMessage(data?.error || error?.message); return; }
    setIntegration(null); setCounts({}); setMessage('Conta Google desconectada.');
  };

  return <DashboardLayout><PageContainer>
    <PageHeader icon={Link2} title="Superpoderes" subtitle="Conecte sua conta Google e mantenha suas informações sincronizadas." />
    <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${integration ? 'bg-emerald-500/15' : 'bg-blue-500/15'}`}>{integration ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <Link2 className="h-6 w-6 text-blue-400" />}</div>
          <div><h2 className="text-xl font-bold text-white">{integration ? 'Google conectado' : 'Conecte sua conta Google'}</h2><p className="mt-1 text-sm text-[#A8B3CF]">{integration?.account_email || 'Uma autorização conecta Agenda, Drive e Gmail em modo seguro.'}</p></div>
        </div>
        <div className="flex flex-wrap gap-3">
          {integration ? <><button onClick={sync} disabled={loading} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Sincronizar agora</button><button onClick={disconnect} disabled={loading} className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-medium text-[#A8B3CF] hover:bg-white/5 hover:text-white"><Unplug className="h-4 w-4" />Desconectar</button></> : <button onClick={connect} disabled={loading} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50"><Link2 className="h-4 w-4" />{loading ? 'Abrindo Google...' : 'Conectar com Google'}</button>}
        </div>
      </div>
      {message && <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-[#D7DEEE]"><AlertCircle className="h-4 w-4 shrink-0 text-blue-400" />{message}</div>}
    </div>
    <PageSection title="Serviços Google">
      <div className="grid gap-6 md:grid-cols-3">
        {services.map(({ icon: Icon, name, key, color, text }) => <div key={key} className="rounded-3xl border border-white/10 bg-[#181C28]/60 p-7 backdrop-blur-xl">
          <div className="flex items-center justify-between"><Icon className={`h-7 w-7 ${color}`} />{integration && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">Conectado</span>}</div>
          <h3 className="mt-6 text-xl font-bold text-white">{name}</h3><p className="mt-3 min-h-[64px] text-sm leading-relaxed text-[#A8B3CF]">{text}</p>
          {counts[key] !== undefined && <p className="mt-5 text-sm font-bold text-white">{counts[key]} itens sincronizados</p>}
        </div>)}
      </div>
    </PageSection>
  </PageContainer></DashboardLayout>;
}
