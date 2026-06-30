import { Outlet, Link } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';
import { PremiumBackground } from '@/features/landing/components';

export function AuthLayout() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-transparent relative overflow-hidden text-white font-sans">
      <PremiumBackground />
      
      {/* Back to Landing */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          to="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#181C28]/80 backdrop-blur-md border border-white/5 text-[#A8B3CF] hover:text-white hover:bg-white/10 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="relative z-10 w-[90%] max-w-[440px] px-4 sm:px-6 mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center w-full">Cash AI</h1>
        </div>

        <div className="bg-[#181C28]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
