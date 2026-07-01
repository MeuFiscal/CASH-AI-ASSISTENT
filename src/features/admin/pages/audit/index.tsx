import { useState, useEffect } from 'react';
import { supabase } from '../../../../core/supabase/client';
import { PageHeader } from '../../../../core/components/PageHeader';
import { Shield, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminAuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  created_at: string;
}

export function AdminAudit() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      const { data, error } = await supabase.rpc('admin_get_audit_logs');
      if (error) {
        console.error('Error in admin_get_audit_logs:', error);
        setErrorMsg(error.message || 'Erro desconhecido ao carregar logs de auditoria.');
      } else if (data) {
        setLogs(data as AdminAuditLog[]);
      }
      setLoading(false);
    }

    loadLogs();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Auditoria"
        description="Histórico das últimas 100 ações críticas no sistema."
      />

      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-sm font-semibold text-[#A8B3CF]">
                <th className="px-6 py-4">Ação</th>
                <th className="px-6 py-4">Entidade</th>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#A8B3CF]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-[#A8B3CF] animate-spin" />
                      Carregando logs de auditoria...
                    </div>
                  </td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-red-500">
                    Erro da API: {errorMsg}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#A8B3CF]">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A8B3CF]">
                          <Shield className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-medium text-white">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">
                      {log.entity_type} <span className="text-white/30 text-xs">({log.entity_id})</span>
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">
                      {log.user_email || 'Sistema'}
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">
                      {format(new Date(log.created_at), "dd 'de' MMM, yyyy HH:mm:ss", { locale: ptBR })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
