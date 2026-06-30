import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { ArrowLeft } from 'lucide-react';
import { PremiumBackground } from '../components/PremiumBackground';

export function PrivacyPolicyPage() {
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
            Política de Privacidade
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

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">1. Coleta de Informações</h2>
          <p className="text-[#A8B3CF] leading-relaxed mb-6">
            O Cash AI coleta informações pessoais e de uso para prover nossos serviços de inteligência artificial. Isso inclui, mas não se limita a: nome, email, dados de contato e informações fornecidas durante o uso da plataforma.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. Uso dos Dados</h2>
          <p className="text-[#A8B3CF] leading-relaxed mb-6">
            As informações coletadas são utilizadas exclusivamente para o funcionamento do serviço de assistente pessoal, análise de interações para melhoria de inteligência artificial e personalização da experiência do usuário.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">3. Segurança</h2>
          <p className="text-[#A8B3CF] leading-relaxed mb-6">
            Implementamos medidas de segurança rígidas para proteger seus dados. Os dados são armazenados de forma segura e não são compartilhados com terceiros para fins de marketing sem o seu consentimento explícito.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">4. Seus Direitos</h2>
          <p className="text-[#A8B3CF] leading-relaxed mb-6">
            Você tem o direito de solicitar o acesso, a correção ou a exclusão dos seus dados pessoais armazenados por nós a qualquer momento.
          </p>
        </div>
      </main>
    </div>
  );
}
