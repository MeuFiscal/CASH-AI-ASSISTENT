import { AdminLayout } from '../../components/AdminLayout';

export function AdminSubscriptions() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Assinaturas</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Gerenciamento de assinaturas.</p>
        </div>
        
        <div className="w-full h-64 border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl flex items-center justify-center">
          <span className="text-[#A8B3CF] font-medium">Módulo em construção</span>
        </div>
      </div>
    </AdminLayout>
  );
}
