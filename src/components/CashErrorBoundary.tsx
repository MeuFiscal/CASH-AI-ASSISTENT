import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function CashErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage = "Ocorreu um erro inesperado. Nossa IA já foi notificada.";
  let errorTitle = "Algo deu errado";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = "Ambiente não encontrado";
      errorMessage = "A área que você tentou acessar não existe ou foi movida.";
    } else {
      errorTitle = `Erro ${error.status}`;
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-[#0B1221] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Premium Dark Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#3B82F6]/10 blur-[120px]" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <div className="p-4 bg-red-500/10 rounded-3xl border border-red-500/20 mb-8">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          {errorTitle}
        </h1>
        
        <p className="text-[#A8B3CF] text-[16px] leading-relaxed mb-10">
          {errorMessage}
        </p>
        
        <Link 
          to="/dashboard"
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
}
