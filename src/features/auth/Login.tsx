import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib';

export function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'password' | 'magic-link'>('password');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'password') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });

        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: identifier,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (magicLinkError) throw magicLinkError;
        alert('Magic Link enviado para ' + identifier);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold text-white mb-1">Acessar Conta</h2>
      <p className="text-[14px] text-[#A8B3CF] mb-6">
        Bem-vindo de volta ao seu Segundo Cérebro.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        {/* Identifier Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A8B3CF]">Email ou Telefone</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B879D]" />
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="seu@email.com ou (11) 90000-0000"
              className="w-full bg-[#0B1221]/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-[#7B879D] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all"
              required
            />
          </div>
        </div>

        {/* Password Field (only in password mode) */}
        {mode === 'password' && (
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#A8B3CF]">Senha</label>
              <Link to="/auth/forgot-password" className="text-[12px] text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B879D]" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B1221]/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-[#7B879D] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all"
                required
              />
            </div>
          </div>
        )}

        {/* Remember Me */}
        {mode === 'password' && (
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#0B1221] border-white/10 text-[#3B82F6] focus:ring-[#3B82F6]"
            />
            <label htmlFor="remember" className="text-[13px] text-[#A8B3CF] cursor-pointer select-none">
              Manter conectado
            </label>
          </div>
        )}

        <button 
          type="submit"
          disabled={loading || !identifier || (mode === 'password' && !password)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-white transition-all mt-4",
            loading || !identifier || (mode === 'password' && !password)
              ? "bg-white/5 text-white/40 cursor-not-allowed"
              : "bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'password' ? 'Entrar no Centro de Inteligência' : 'Enviar Magic Link'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

      </form>

      {/* Mode Switcher */}
      <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
        <button 
          onClick={() => setMode(mode === 'password' ? 'magic-link' : 'password')}
          className="text-[13px] text-[#A8B3CF] hover:text-white transition-colors"
        >
          {mode === 'password' ? 'Entrar com Magic Link' : 'Entrar com Senha'}
        </button>
      </div>

    </div>
  );
}
