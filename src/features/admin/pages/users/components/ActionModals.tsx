import React, { useState } from 'react';
import { X, Shield, CreditCard, Ban, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onSuccess: () => void;
}

export function RoleModal({ isOpen, onClose, userId, userName, onSuccess }: BaseModalProps & { currentRole: string }) {
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.rpc('admin_update_role', { p_user_id: userId, p_role: role });
    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert('Erro ao atualizar papel: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-[#181C28] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Alterar Papel</h3>
          </div>
          <button onClick={onClose} className="text-[#A8B3CF] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#A8B3CF]">
            Defina o nível de acesso para <strong className="text-white">{userName}</strong>.
          </p>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-xs text-yellow-200">
              Atenção: Conceder acesso de Admin ou Super Admin permite controle total sobre a plataforma.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {['user', 'support', 'admin', 'super_admin'].map((r) => (
              <label key={r} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${role === r ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <input type="radio" name="role" value={r} checked={role === r} onChange={(e) => setRole(e.target.value)} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm text-white font-medium capitalize">{r.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex gap-3 bg-black/20">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
            {loading ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlanModal({ isOpen, onClose, userId, userName, onSuccess }: BaseModalProps & { currentPlan?: string }) {
  const [planId, setPlanId] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      supabase.from('plans').select('*').then(({ data }) => setPlans(data || []));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.rpc('admin_update_plan', { p_user_id: userId, p_plan_id: planId });
    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert('Erro ao atualizar plano: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-[#181C28] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Alterar Plano</h3>
          </div>
          <button onClick={onClose} className="text-[#A8B3CF] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#A8B3CF]">
            Selecione o novo plano para o workspace principal de <strong className="text-white">{userName}</strong>.
          </p>
          <div className="space-y-2 pt-2">
            {plans.map((p) => (
              <label key={p.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${planId === p.id ? 'bg-purple-500/10 border-purple-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <input type="radio" name="plan" value={p.id} checked={planId === p.id} onChange={(e) => setPlanId(e.target.value)} className="w-4 h-4 accent-purple-500" />
                <div className="flex flex-col">
                  <span className="text-sm text-white font-medium">{p.name}</span>
                  <span className="text-xs text-[#A8B3CF]">R$ {p.price} / {p.interval}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex gap-3 bg-black/20">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={loading || !planId} className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
            {loading ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BlockModal({ isOpen, onClose, userId, userName, onSuccess, isBlocked }: BaseModalProps & { isBlocked: boolean }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    const { error } = isBlocked 
      ? await supabase.rpc('admin_activate_user', { p_user_id: userId })
      : await supabase.rpc('admin_block_user', { p_user_id: userId, p_reason: reason });
      
    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert('Erro: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-[#181C28] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {isBlocked ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Ban className="w-5 h-5 text-red-400" />}
            <h3 className="text-lg font-semibold text-white">{isBlocked ? 'Desbloquear Usuário' : 'Bloquear Usuário'}</h3>
          </div>
          <button onClick={onClose} className="text-[#A8B3CF] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#A8B3CF]">
            Tem certeza que deseja {isBlocked ? 'desbloquear' : 'bloquear'} o acesso de <strong className="text-white">{userName}</strong>?
          </p>
          {!isBlocked && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Motivo do Bloqueio (Opcional)</label>
              <textarea 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: Inadimplência, Violação de termos..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-red-500/50 resize-none h-24"
              />
            </div>
          )}
        </div>
        <div className="p-6 border-t border-white/5 flex gap-3 bg-black/20">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={loading} className={`flex-1 px-4 py-2 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
            {loading ? 'Processando...' : isBlocked ? 'Sim, Desbloquear' : 'Sim, Bloquear'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SoftDeleteModal({ isOpen, onClose, userId, userName, onSuccess }: BaseModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.rpc('admin_soft_delete_user', { p_user_id: userId });
    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-[#181C28] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Excluir Usuário</h3>
          </div>
          <button onClick={onClose} className="text-[#A8B3CF] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-200">
              Você está prestes a desativar a conta de <strong className="text-white">{userName}</strong>. Esta é uma exclusão lógica (Soft Delete) e pode ser revertida pelo banco de dados posteriormente.
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex gap-3 bg-black/20">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
            {loading ? 'Processando...' : 'Excluir Conta'}
          </button>
        </div>
      </div>
    </div>
  );
}
