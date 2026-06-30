import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { ROUTES } from '@/constants';
import { PremiumBackground } from '../components/PremiumBackground';

/* ── Brand SVG Icons ── */

function WhatsAppIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 259" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M67.663 221.823l4.185 2.093c17.44 10.463 36.971 15.346 56.503 15.346 61.385 0 111.609-50.224 111.609-111.609 0-29.297-11.859-57.897-32.785-78.824-20.927-20.927-48.83-32.785-78.824-32.785-61.385 0-111.61 50.224-111.61 111.61 0 20.927 6.278 41.156 16.741 58.594l2.79 4.186-11.16 41.156 41.55-10.167z" fill="#25D366"/>
      <path d="M219.033 37.668C194.938 13.573 162.533 0 128.351 0 57.898 0 .698 57.2.698 127.654c0 22.322 6.278 44.645 16.74 63.48L0 259l70.454-18.136c18.835 10.463 39.762 15.346 60.69 15.346 70.453 0 127.653-57.2 127.653-127.653 0-34.183-13.573-66.588-39.764-90.889zM128.35 233.467c-18.835 0-37.668-4.882-53.712-14.648l-4.185-2.093-40.458 10.463 10.463-39.762-2.79-4.186C17.44 150.674 11.86 139.513 11.86 127.654c0-64.178 52.318-116.497 116.497-116.497 31.394 0 60.688 12.556 82.312 34.18 21.623 21.624 34.18 50.918 34.18 82.312-.698 64.178-52.318 115.8-116.498 115.8v.018z" fill="#25D366"/>
      <path d="M187.032 156.252c-3.488-1.744-20.927-10.463-24.415-11.509-3.488-1.744-5.58-1.744-8.37 1.744-2.79 3.488-10.463 11.509-13.253 14.299-2.79 2.79-4.882 2.79-8.37 1.047-3.488-1.744-14.648-5.58-27.901-16.74-10.463-9.068-16.741-20.23-19.53-23.718-2.79-3.488 0-5.58 2.092-6.976l5.58-6.278c1.744-1.744 2.79-3.488 4.185-5.58 1.395-2.093 0-4.186-.698-5.58-1.395-1.744-8.37-20.23-11.16-27.204-2.79-6.976-5.58-6.278-8.37-6.278-2.79 0-4.882-.698-7.672-.698-2.79 0-6.976 1.047-10.463 4.534-3.488 3.488-13.254 12.556-13.254 31.394 0 18.835 13.254 36.274 15.346 39.064 1.744 2.79 26.506 41.854 65.57 57.2 9.067 4.185 16.044 6.278 21.623 8.37 9.068 3.487 17.44 2.79 23.717 1.743 6.977-1.047 20.928-8.37 23.718-16.74 2.79-8.371 2.79-15.347 1.744-16.74-1.047-1.744-3.488-2.79-6.977-4.534z" fill="#FDFDFD"/>
    </svg>
  );
}

function GoogleCalendarIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M195.368 60.632h-9.895V39.79l-30.316 20.842H60.632V195.368l20.842-1.263V215.368l20.842-20.842h93.052V60.632z" fill="#fff"/>
      <path d="M195.368 256L256 195.368h-60.632V256z" fill="#EA4335"/>
      <path d="M256 60.632h-60.632v134.736H256V60.632z" fill="#4285F4"/>
      <path d="M195.368 195.368H60.632V256h134.736v-60.632z" fill="#34A853"/>
      <path d="M0 195.368V256h60.632v-60.632H0z" fill="#188038"/>
      <path d="M0 60.632v134.736h60.632V60.632H0z" fill="#1967D2"/>
      <path d="M60.632 0H0v60.632h60.632V0z" fill="#1967D2"/>
      <path d="M195.368 0H60.632v60.632h134.736V0z" fill="#4285F4"/>
      <path d="M195.368 60.632V0L256 60.632h-60.632z" fill="#1A73E8"/>
      {/* Calendar grid lines */}
      <rect x="88" y="88" width="80" height="12" rx="2" fill="#4285F4"/>
      <rect x="88" y="112" width="80" height="12" rx="2" fill="#4285F4" opacity="0.7"/>
      <rect x="88" y="136" width="60" height="12" rx="2" fill="#4285F4" opacity="0.5"/>
      <rect x="88" y="160" width="50" height="12" rx="2" fill="#4285F4" opacity="0.3"/>
    </svg>
  );
}

function OutlookIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M256 128l-79.2-44V77.6L256 121.6V128z" fill="#0364B8"/>
      <path d="M110.4 108.8L256 40v81.6l-79.2 6.4-66.4-19.2z" fill="#0A2767"/>
      <path d="M256 40l-79.2 88L256 216V40z" fill="#28A8EA"/>
      <path d="M176.8 128L256 216H110.4l66.4-88z" fill="#0078D4"/>
      <path d="M256 216H110.4l66.4-88L256 216z" fill="#0364B8"/>
      <path d="M176.8 128L256 40v176l-79.2-88z" fill="#14447D" opacity="0.5"/>
      <path d="M110.4 216V40L0 80v136l110.4 0z" fill="#0078D4"/>
      <ellipse cx="55.2" cy="128" rx="32" ry="36" fill="#fff"/>
    </svg>
  );
}

const integrations = [
  { Icon: WhatsAppIcon, name: 'WhatsApp', color: '#25D366', glow: 'rgba(37,211,102,0.4)', bg: '#25D366', desc: 'Registre gastos e consulte relatórios diretamente pelo WhatsApp com linguagem natural.' },
  { Icon: GoogleCalendarIcon, name: 'Google Agenda', color: '#4285F4', glow: 'rgba(66,133,244,0.4)', bg: '#fff', desc: 'Sincronize lembretes de contas, reuniões e compromissos automaticamente.' },
  { Icon: OutlookIcon, name: 'Outlook', color: '#0078D4', glow: 'rgba(0,120,212,0.4)', bg: '#0078D4', desc: 'Conecte seu e-mail corporativo e receba resumos financeiros e agendamentos.' },
];

export function IntegracoesPage() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: '#0B1221',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <PremiumBackground />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,9,13,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto', padding: '16px 24px', boxSizing: 'border-box' }}>
          <Link to={ROUTES.LANDING} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft style={{ width: 20, height: 20, color: '#A8B3CF' }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>Voltar</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain style={{ width: 22, height: 22, color: '#3B82F6' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Cash AI</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '64px 24px 80px', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px auto' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 20px 0' }}>
            Conectado ao seu Ecossistema.
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A8B3CF', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            O Cash AI vive nos apps que você já usa todos os dias. Sem baixar nada novo.
          </p>
        </div>

        {/* Planet Animation */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto 80px auto', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Core */}
          <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(59,130,246,0.4)', zIndex: 20 }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#000', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain style={{ width: 48, height: 48, color: '#3B82F6' }} />
            </div>
          </div>

          {/* Orbit rings */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', animation: 'spin 20s linear infinite' }} />
          <div style={{ position: 'absolute', width: '70%', height: '70%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', animation: 'spin 15s linear infinite reverse' }} />

          {/* Orbiting icons */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', animation: 'spin 20s linear infinite', zIndex: 30 }}>
            {/* WhatsApp */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: 68, height: 68, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(37,211,102,0.5)', animation: 'spin 20s linear infinite reverse', border: '4px solid #0B1221' }}>
              <WhatsAppIcon size={36} />
            </div>
            {/* Google Calendar */}
            <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 68, height: 68, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(66,133,244,0.4)', animation: 'spin 20s linear infinite reverse', border: '4px solid #0B1221' }}>
              <GoogleCalendarIcon size={36} />
            </div>
            {/* Outlook */}
            <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 68, height: 68, borderRadius: '50%', background: '#0A2767', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0,120,212,0.5)', animation: 'spin 20s linear infinite reverse', border: '4px solid #0B1221' }}>
              <OutlookIcon size={36} />
            </div>
          </div>
        </div>

        {/* Integration Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24, width: '100%' }}>
          {integrations.map((item, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <item.Icon size={32} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 12px 0' }}>{item.name}</h3>
              <p style={{ fontSize: 15, color: '#A8B3CF', lineHeight: 1.7, fontWeight: 500, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
