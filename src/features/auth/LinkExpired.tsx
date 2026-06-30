import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function LinkExpired() {
  return (
    <div className="flex flex-col items-center text-center w-full animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 rounded-full bg-[#ef4444]/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-[#ef4444]" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Link Expirado</h2>
      <p className="text-[14px] text-[#A8B3CF] mb-8 leading-relaxed">
        O link de autenticação que você tentou acessar expirou ou já foi utilizado. Por segurança, os links mágicos são válidos apenas por 24 horas e para um único uso.
      </p>
      
      <div className="flex flex-col w-full gap-3">
        <Link 
          to="/auth/login"
          className="w-full flex items-center justify-center py-3 rounded-xl text-[14px] font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          Solicitar novo link
        </Link>
      </div>
    </div>
  );
}
