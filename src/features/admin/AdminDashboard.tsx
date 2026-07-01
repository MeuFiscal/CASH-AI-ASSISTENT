import { AdminLayout } from './components/AdminLayout';
import { Users, Building2, Wallet, BrainCircuit } from 'lucide-react';

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Centro de Operações</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Visão geral do sistema e indicadores de saúde da plataforma.</p>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          
          <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[#A8B3CF]">
              <Users className="w-5 h-5 text-[#3B82F6]" />
              <span className="text-sm font-medium">Usuários Ativos</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">0</span>
              <span className="text-sm text-green-400 font-medium mb-1">+0%</span>
            </div>
          </div>

          <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[#A8B3CF]">
              <Building2 className="w-5 h-5 text-[#10B981]" />
              <span className="text-sm font-medium">Workspaces</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">0</span>
            </div>
          </div>

          <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[#A8B3CF]">
              <Wallet className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-sm font-medium">Receita MRR</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">R$ 0,00</span>
            </div>
          </div>

          <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[#A8B3CF]">
              <BrainCircuit className="w-5 h-5 text-[#8B5CF6]" />
              <span className="text-sm font-medium">Tokens OpenAI</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">0</span>
              <span className="text-sm text-[#A8B3CF] font-medium mb-1">hoje</span>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
