import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao solicitar redefinição.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center w-full animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Email Enviado</h2>
        <p className="text-[14px] text-[#A8B3CF] mb-8 leading-relaxed">
          Enviamos um link de redefinição para <strong>{email}</strong>. 
          Verifique sua caixa de entrada e pasta de spam.
        </p>
        <Link 
          to="/auth/login"
          className="text-[14px] font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
        >
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <Link to="/auth/login" className="flex items-center gap-2 text-[13px] text-[#A8B3CF] hover:text-white transition-colors mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      
      <h2 className="text-xl font-semibold text-white mb-1">Recuperar Senha</h2>
      <p className="text-[14px] text-[#A8B3CF] mb-6">
        Digite seu email para receber um link de redefinição.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A8B3CF]">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B879D]" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-[#0B1221]/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-[#7B879D] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || !email}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-white transition-all mt-4",
            loading || !email
              ? "bg-white/5 text-white/40 cursor-not-allowed"
              : "bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar link de recuperação'}
        </button>
      </form>
    </div>
  );
}
