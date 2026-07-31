import { useState } from 'react';
import { ArrowDown, ArrowUp, CalendarPlus, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';

type ActionType = 'income' | 'expense' | 'event';
const actions = [
  { type: 'income' as const, label: 'Adicionar entrada', hint: 'Salário, depósito ou saldo', icon: ArrowUp, bg: 'bg-emerald-500/10', fg: 'text-emerald-400' },
  { type: 'expense' as const, label: 'Adicionar gasto', hint: 'Compra, conta ou pagamento', icon: ArrowDown, bg: 'bg-rose-500/10', fg: 'text-rose-400' },
  { type: 'event' as const, label: 'Novo compromisso', hint: 'Reunião, consulta ou lembrete', icon: CalendarPlus, bg: 'bg-blue-500/10', fg: 'text-blue-400' },
];

export function QuickActions() {
  const { user } = useAuth();
  const { refreshDashboard } = useDashboard();
  const [active, setActive] = useState<ActionType | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    setActive(null); setDescription(''); setAmount(''); setStartTime('');
    setEndTime(''); setLocation(''); setError('');
  };

  const save = async () => {
    if (!active || !description.trim() || !user?.id) return;
    setLoading(true); setError('');
    try {
      const { data: member } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).limit(1).maybeSingle();
      const workspaceId = member?.workspace_id;
      if (!workspaceId) throw new Error('Workspace não encontrado.');

      if (active === 'event') {
        if (!startTime) throw new Error('Informe o início do compromisso.');
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date(start.getTime() + 3600000);
        if (end <= start) throw new Error('O término deve ser depois do início.');
        const { error: insertError } = await supabase.from('calendar_events').insert({
          workspace_id: workspaceId, title: description.trim(), start_time: start.toISOString(),
          end_time: end.toISOString(), location: location.trim() || null, event_status: 'pending',
        });
        if (insertError) throw insertError;
      } else {
        const numericAmount = Number(amount.replace(',', '.'));
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) throw new Error('Informe um valor válido.');
        let { data: account } = await supabase.from('accounts').select('id').eq('workspace_id', workspaceId).order('created_at').limit(1).maybeSingle();
        if (!account) {
          const { data: created, error: accountError } = await supabase.from('accounts').insert({ workspace_id: workspaceId, name: 'Conta principal', type: 'checking' }).select('id').single();
          if (accountError) throw accountError;
          account = created;
        }
        const { error: insertError } = await supabase.from('transactions').insert({
          workspace_id: workspaceId, account_id: account.id, type: active, amount: numericAmount,
          description: description.trim(), date: new Date().toISOString(), status: 'completed',
        });
        if (insertError) throw insertError;
      }
      await refreshDashboard(); close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.');
    } finally { setLoading(false); }
  };

  const title = active === 'income' ? 'Adicionar entrada' : active === 'expense' ? 'Adicionar gasto' : 'Novo compromisso';
  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500';

  return <>
    <section className="mb-7 rounded-[28px] border border-white/10 bg-gradient-to-r from-[#151D30]/90 via-[#111827]/80 to-[#0C2430]/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Acesso rápido</p><h2 className="mt-1 text-xl font-bold text-white">O que você quer registrar?</h2></div>
        <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 sm:flex"><Plus className="h-5 w-5 text-blue-400" /></div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {actions.map(({ type, label, hint, icon: Icon, bg, fg }) => <button key={type} onClick={() => setActive(type)} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg}`}><Icon className={`h-5 w-5 ${fg}`} /></span>
          <span><strong className="block text-sm text-white">{label}</strong><small className="mt-1 block text-xs text-[#A8B3CF]">{hint}</small></span>
        </button>)}
      </div>
    </section>
    {active && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-3xl border border-white/10 bg-[#151B29] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-bold text-white">{title}</h2><button onClick={close} className="rounded-xl p-2 text-[#A8B3CF] hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button></div>
        <div className="space-y-4">
          <label className="block"><span className="mb-2 block text-sm font-medium text-[#A8B3CF]">{active === 'event' ? 'Título' : 'Descrição'}</span><input value={description} onChange={(e) => setDescription(e.target.value)} autoFocus className={inputClass} placeholder={active === 'event' ? 'Ex: Reunião com contador' : 'Ex: Salário ou supermercado'} /></label>
          {active !== 'event' ? <label className="block"><span className="mb-2 block text-sm font-medium text-[#A8B3CF]">Valor</span><input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className={inputClass} placeholder="0,00" /></label> : <>
            <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium text-[#A8B3CF]">Início</span><input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} /></label><label><span className="mb-2 block text-sm font-medium text-[#A8B3CF]">Término</span><input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} /></label></div>
            <label className="block"><span className="mb-2 block text-sm font-medium text-[#A8B3CF]">Local (opcional)</span><input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} /></label>
          </>}
          {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <button onClick={save} disabled={loading || !description.trim()} className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white hover:bg-blue-500 disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </div>}
  </>;
}
