import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { ROUTES } from '@/constants';
import { PremiumBackground } from '../components/PremiumBackground';

export function EmpresaPage() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100dvh', background: '#0B1221', overflowX: 'hidden', overflowY: 'auto' }}>
      <PremiumBackground />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,9,13,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <Link to={ROUTES.LANDING} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft style={{ width: 20, height: 20, color: '#A8B3CF' }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>Voltar</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Brain style={{ width: 22, height: 22, color: '#3B82F6' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Cash AI</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
        {/* Logo */}
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px auto', boxShadow: '0 0 50px rgba(59,130,246,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Brain style={{ width: 48, height: 48, color: '#3B82F6' }} />
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, textAlign: 'center', marginBottom: 40 }}>
          Nossa Missão
        </h1>

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A8B3CF', lineHeight: 1.8, fontWeight: 500, marginBottom: 32 }}>
            Acreditamos que a gestão financeira não deve ser um fardo. Nascemos com um propósito claro:{' '}
            <strong style={{ color: '#fff', fontWeight: 700 }}>Democratizar a inteligência financeira</strong>{' '}
            através da IA mais simples e acessível do mundo.
          </p>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A8B3CF', lineHeight: 1.8, fontWeight: 500, marginBottom: 32 }}>
            Enquanto bancos e aplicativos tradicionais te forçam a preencher dezenas de formulários e planilhas,
            nós criamos o <strong style={{ color: '#fff', fontWeight: 700 }}>Cash AI</strong> para se adaptar a você.
            Basta falar naturalmente, como se fosse um amigo, e nosso sistema cuida de toda a complexidade contábil em milissegundos.
          </p>
          <p style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: '#fff', fontWeight: 800, lineHeight: 1.5, paddingTop: 16 }}>
            Estamos construindo o futuro da produtividade pessoal.<br />E começa aqui.
          </p>
        </div>
      </div>
    </div>
  );
}
