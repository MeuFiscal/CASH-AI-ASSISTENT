import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Check, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants';
import { PremiumBackground } from '../components/PremiumBackground';

const benefits = [
  "Registro ilimitado de gastos",
  "Integração com WhatsApp",
  "Sincronização com Google Agenda",
  "Relatórios e gráficos detalhados",
  "Suporte VIP prioritário",
  "Novas features inclusas",
];

export function PrecosPage() {
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
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px auto' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 20 }}>
            Invista na sua paz financeira.
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A8B3CF', fontWeight: 500, lineHeight: 1.6 }}>
            Um valor pequeno para organizar sua vida inteira com Inteligência Artificial.
          </p>
        </div>

        {/* Pricing Card */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
          {/* Glow */}
          <div style={{ position: 'absolute', inset: -40, background: 'linear-gradient(180deg, rgba(139,92,246,0.25), rgba(59,130,246,0.25))', filter: 'blur(100px)', borderRadius: 80, zIndex: -1, pointerEvents: 'none' }} />

          <div style={{ width: '100%', background: 'rgba(15,17,26,0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 40, padding: '40px 40px 48px', position: 'relative', overflow: 'hidden' }}>
            {/* Badge */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 24px', borderRadius: '0 0 16px 16px' }}>
              Oferta de Lançamento
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', textAlign: 'center', marginTop: 24 }}>Cash AI Premium</h3>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <span style={{ fontSize: 22, color: '#EF4444', textDecoration: 'line-through', fontWeight: 500, opacity: 0.8 }}>R$ 129,90</span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>R$ 54,90</span>
              <span style={{ fontSize: 18, color: '#A8B3CF', fontWeight: 500, marginLeft: 8 }}>/mês</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check style={{ width: 14, height: 14, color: '#34D399' }} />
                  </div>
                  <span style={{ color: '#fff', fontWeight: 500, fontSize: 16 }}>{b}</span>
                </div>
              ))}
            </div>

            <button style={{ width: '100%', height: 64, background: '#fff', color: '#000', borderRadius: 16, fontWeight: 700, fontSize: 20, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 0 30px rgba(255,255,255,0.3)', transition: 'transform 0.2s' }}>
              Iniciar Agora <ArrowRight style={{ width: 24, height: 24 }} />
            </button>
            <p style={{ textAlign: 'center', fontSize: 14, color: '#A8B3CF', marginTop: 24, fontWeight: 500 }}>Cancele a qualquer momento. Sem fidelidade.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
