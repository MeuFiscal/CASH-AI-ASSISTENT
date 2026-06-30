import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Settings as SettingsIcon, Bell, Shield, Wallet, Smartphone } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';

export function Settings() {
  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader 
          icon={SettingsIcon}
          title="Configurações"
          subtitle="Ajustes gerais do sistema."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Menu Lateral de Navegação Interna */}
          <div className="md:col-span-1 flex flex-col gap-2">
            {[
              { icon: Shield, label: 'Privacidade', active: true },
              { icon: Bell, label: 'Alertas', active: false },
              { icon: Wallet, label: 'Contas Bancárias', active: false },
              { icon: Smartphone, label: 'Dispositivos', active: false },
            ].map(item => (
              <button key={item.label} className={`flex items-center gap-3 p-4 rounded-2xl transition-colors ${item.active ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20' : 'text-[#A8B3CF] hover:bg-white/5 border border-transparent'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-[15px]">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo da Configuração */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            <section className="p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-white" />
                <h2 className="text-[16px] font-bold text-white tracking-wide">Privacidade dos Dados</h2>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-white font-medium text-[15px]">Compartilhamento de Anônimos</p>
                  <p className="text-[#A8B3CF] text-[13px] mt-1">Permite usar seus dados anonimizados para melhorar a IA.</p>
                </div>
                <div className="w-12 h-6 bg-[#3B82F6] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-white font-medium text-[15px]">Treinamento Específico</p>
                  <p className="text-[#A8B3CF] text-[13px] mt-1">Permite que a IA aprenda o seu padrão de fala e escrita.</p>
                </div>
                <div className="w-12 h-6 bg-[#3B82F6] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </section>

            <section className="p-6 sm:p-8 rounded-3xl bg-red-500/5 border border-red-500/20 backdrop-blur-xl flex flex-col gap-4">
              <h2 className="text-[16px] font-bold text-red-500 tracking-wide">Zona de Risco</h2>
              <p className="text-[#A8B3CF] text-[14px]">Ações irreversíveis relacionadas à sua conta.</p>
              
              <div className="mt-2">
                <button className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-[14px] transition-colors border border-red-500/20 w-full sm:w-auto">
                  Excluir Minha Conta
                </button>
              </div>
            </section>

          </div>
        </div>

      </PageContainer>
    </DashboardLayout>
  );
}
