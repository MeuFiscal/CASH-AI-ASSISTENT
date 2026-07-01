import { useState } from 'react';
import { createPortal } from 'react-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Zap, Calendar, Database, Mail, Lock, Crown, X } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useNavigate } from 'react-router-dom';

export function Superpowers() {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    setIsPremiumModalOpen(true);
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader 
          icon={Zap}
          title="Superpoderes"
          subtitle="Conecte sua IA aos aplicativos que você já usa."
        />

        <PageSection title="Conexões Disponíveis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20 backdrop-blur-xl relative overflow-hidden group flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-[11px] font-bold tracking-widest uppercase">
                Conectado
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">WhatsApp</h2>
            <p className="text-[#A8B3CF] text-[15px] leading-relaxed mb-6 font-medium">
              Registre gastos.<br />
              Crie compromissos.<br />
              Converse naturalmente.
            </p>
            <div className="mt-auto">
              <button onClick={handlePremiumClick} className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                Gerenciar Conexão
              </button>
            </div>
          </div>

          {/* Google Agenda */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:bg-[#181C28]/80 transition-colors flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-[#3B82F6]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Google Agenda</h2>
            </div>
            <p className="text-[#A8B3CF] text-[15px] leading-relaxed mb-6 font-medium">
              Nunca mais esqueça reuniões.<br />
              Tudo sincronizado automaticamente.
            </p>
            <div className="mt-auto">
              <button onClick={handlePremiumClick} className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold transition-colors">
                Conectar
              </button>
            </div>
          </div>

          {/* Google Drive */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:bg-[#181C28]/80 transition-colors flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-[#10B981]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Google Drive</h2>
            </div>
            <p className="text-[#A8B3CF] text-[15px] leading-relaxed mb-6 font-medium">
              Sua IA lê seus documentos.<br />
              Resumos e buscas instantâneas.
            </p>
            <div className="mt-auto">
              <button onClick={handlePremiumClick} className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold transition-colors">
                Conectar
              </button>
            </div>
          </div>

          {/* Gmail */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:bg-[#181C28]/80 transition-colors flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-6 h-6 text-[#ef4444]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Gmail</h2>
            </div>
            <p className="text-[#A8B3CF] text-[15px] leading-relaxed mb-6 font-medium">
              A IA lê boletos enviados por email.<br />
              Lembretes automáticos de vencimento.
            </p>
            <div className="mt-auto">
              <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[#A8B3CF] font-medium cursor-not-allowed">
                Em breve
              </button>
            </div>
          </div>
          </div>

        </PageSection>

        {/* Premium Glassmorphism Modal */}
        {isPremiumModalOpen && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0B1221]/80 backdrop-blur-md" onClick={() => setIsPremiumModalOpen(false)} />
            
            <div className="relative w-[90vw] max-w-md min-w-[320px] sm:min-w-[400px] bg-[#181C28]/90 border border-[#F59E0B]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setIsPremiumModalOpen(false)}
                className="absolute top-6 right-6 text-[#A8B3CF] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg shadow-[#F59E0B]/20">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white text-center mb-2">Recurso Premium</h3>
              <p className="text-[#A8B3CF] text-center text-[15px] leading-relaxed mb-8">
                As conexões externas e integrações com aplicativos são exclusivas para assinantes do plano Premium do Cash AI.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsPremiumModalOpen(false);
                    navigate('/premium');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-[15px] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
                >
                  <Crown className="w-5 h-5" />
                  Fazer Upgrade Agora
                </button>
                
                <button 
                  onClick={() => setIsPremiumModalOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Continuar no Grátis
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      </PageContainer>
    </DashboardLayout>
  );
}
