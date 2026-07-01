import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { PremiumBackground } from '@/features/landing/components/PremiumBackground';

export function MagicLinkCallback() {
  const { isAuthenticated, isLoading, globalRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    // Se o AuthContext terminar de carregar e o usuário estiver autenticado:
    if (!isLoading) {
      if (isAuthenticated) {
        if (globalRole === 'super_admin' || globalRole === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          const redirectUrl = searchParams.get('redirect') || '/dashboard';
          navigate(redirectUrl, { replace: true });
        }
      } else {
        // Se carregou mas não autenticou, provavelmente o token expirou ou é inválido
        setError(true);
      }
    }
  }, [isLoading, isAuthenticated, globalRole, navigate, searchParams]);

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <PremiumBackground />
        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#ef4444]/10 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Link Expirado</h2>
          <p className="text-[#A8B3CF] text-[15px] mb-8 leading-relaxed">
            Este acesso expirou por segurança. Peça um novo acesso no seu WhatsApp para continuar utilizando seu Centro de Inteligência.
          </p>
          <button 
            onClick={() => window.location.href = 'https://wa.me/seunumerodowhatsapp'} // Opcional: link direto
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20 transition-all font-bold text-[#3B82F6]"
          >
            Solicitar novo acesso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <PremiumBackground />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
        <p className="text-lg font-medium text-white tracking-wide animate-pulse">
          Acessando Centro de Inteligência...
        </p>
      </div>
    </div>
  );
}
