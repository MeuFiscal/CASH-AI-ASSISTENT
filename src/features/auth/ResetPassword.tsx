import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we actually have a session (user is signed in by the recovery link)
    // If not, maybe the link is invalid or expired
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // If there's no session, we shouldn't be here, or maybe they just didn't wait for auth state change.
        // Usually, the hash fragment is processed automatically by supabase-js.
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login-transition');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao atualizar a senha.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center w-full animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-[#10B981]" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Senha Atualizada!</h2>
        <p className="text-[14px] text-[#A8B3CF] mb-8">
          Sua senha foi alterada com sucesso. Redirecionando...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold text-white mb-1">Criar Nova Senha</h2>
      <p className="text-[14px] text-[#A8B3CF] mb-6">
        Digite sua nova senha abaixo.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A8B3CF]">Nova Senha</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B879D]" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className="w-full bg-[#0B1221]/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-[#7B879D] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A8B3CF]">Confirmar Nova Senha</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B879D]" />
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
              className="w-full bg-[#0B1221]/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-[#7B879D] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-white transition-all mt-4",
            loading || !password || !confirmPassword
              ? "bg-white/5 text-white/40 cursor-not-allowed"
              : "bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>Atualizar Senha <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </div>
  );
}
