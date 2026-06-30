import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { ArrowLeft } from 'lucide-react';
import { PremiumBackground } from '../components/PremiumBackground';

export function TermsOfUsePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-transparent relative overflow-y-auto overflow-x-hidden text-white font-sans">
      <PremiumBackground />
      
      {/* Navbar Minimalista */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0B1221]/40 backdrop-blur-xl">
        <Link to={ROUTES.LANDING} className="flex items-center gap-2 text-[#A8B3CF] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-[14px]">Voltar para o Início</span>
        </Link>
      </nav>

      {/* Conteúdo */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Termos de Uso
          </h1>
          <p className="text-[#A8B3CF] text-lg">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="prose prose-invert prose-blue max-w-none">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Sobre a Operação</h3>
            <p className="text-[#A8B3CF] m-0">
              <strong>Cash AI</strong><br/>
              Operado por:<br/>
              <strong>JULIANA CROXIATTI KOSTKA</strong><br/>
              CNPJ: 46.192.328/0001-58
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">1. Aceitação dos Termos</h2>
          <p className="text-[#A8B3CF] leading-relaxed mb-6">
            Ao acessar e utilizar a plataforma Cash AI, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este serviço.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. Uso da Plataforma</h2>
          <p className="text-[#A8B3CF] leading-relaxed mb-6">
            A plataforma deve ser utilizada para fins lícitos. Não é permitido utilizar o Cash AI para atividades ilegais, fraudulentas ou que violem os direitos de terceiros. A inteligência artificial é uma ferramenta de suporte, e o usuário é responsável por validar e garantir a corretude das ações realizadas através da ferramenta.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">3. Modificações do Serviço</h2>
          <p className="text-[#A8B3CF] leading-relaxed mb-6">
            O Cash AI reserva-se o direito de modificar, suspender ou descontinuar qualquer recurso do serviço a qualquer momento, sem aviso prévio. Não seremos responsáveis perante você ou qualquer terceiro por qualquer modificação, alteração de preço, suspensão ou descontinuação do Serviço.
          </p>
        </div>
      </main>
    </div>
  );
}
