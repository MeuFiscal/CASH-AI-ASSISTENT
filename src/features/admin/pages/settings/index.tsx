import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { PageHeader } from '../../../../components/PageHeader';
import { AdminLayout } from '../../components/AdminLayout';
import { Settings, Save, AlertTriangle, ShieldCheck, Mail, Clock } from 'lucide-react';

interface PlatformSettings {
  maintenance_mode: boolean;
  allow_new_registrations: boolean;
  free_trial_days: number;
  support_email: string;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase.rpc('admin_get_platform_settings');
      if (error) {
        console.error('Error fetching settings:', error);
        setErrorMsg('Erro ao carregar configurações.');
      } else if (data) {
        setSettings(data as PlatformSettings);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const { data, error } = await supabase.rpc('admin_update_platform_settings', {
      p_maintenance_mode: settings.maintenance_mode,
      p_allow_new_registrations: settings.allow_new_registrations,
      p_free_trial_days: settings.free_trial_days,
      p_support_email: settings.support_email
    });

    if (error) {
      console.error('Error saving settings:', error);
      setErrorMsg('Erro ao salvar as configurações.');
    } else {
      setSuccessMsg('Configurações salvas com sucesso!');
      setSettings(data as PlatformSettings);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-[#A8B3CF]">
          <Settings className="w-8 h-8 animate-spin" />
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <PageHeader
        icon={Settings}
        title="Configurações Globais"
        subtitle="Gerencie o comportamento geral da plataforma Cash AI."
      />

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* Registration Settings */}
        <div className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Acesso e Registros
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Permitir Novos Cadastros</h3>
                <p className="text-sm text-[#A8B3CF] mt-1">Habilita ou desabilita a criação de novas contas.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings?.allow_new_registrations || false}
                  onChange={(e) => setSettings(s => s ? {...s, allow_new_registrations: e.target.checked} : null)}
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Dias de Free Trial</h3>
                <p className="text-sm text-[#A8B3CF] mt-1">Quantidade de dias grátis para novos workspaces.</p>
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#A8B3CF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number"
                  min="0"
                  max="30"
                  className="w-24 bg-[#181C28] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  value={settings?.free_trial_days || 0}
                  onChange={(e) => setSettings(s => s ? {...s, free_trial_days: parseInt(e.target.value)} : null)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-blue-400" />
            Contato e Suporte
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-1">Email de Suporte</label>
              <p className="text-sm text-[#A8B3CF] mb-3">Email principal para o qual as dúvidas dos usuários serão enviadas.</p>
              <input 
                type="email"
                className="w-full bg-[#181C28] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                value={settings?.support_email || ''}
                onChange={(e) => setSettings(s => s ? {...s, support_email: e.target.value} : null)}
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0B0F19] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl relative group p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </h2>

          <div className="flex items-center justify-between bg-red-500/5 p-4 rounded-xl border border-red-500/10">
            <div>
              <h3 className="text-white font-medium">Modo de Manutenção</h3>
              <p className="text-sm text-red-400/80 mt-1">Derruba o acesso de todos os usuários. Use com extremo cuidado!</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings?.maintenance_mode || false}
                onChange={(e) => setSettings(s => s ? {...s, maintenance_mode: e.target.checked} : null)}
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
        >
          {saving ? (
            <Settings className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
    </AdminLayout>
  );
}
