import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

/**
 * Stub page for routes not yet implemented.
 * Shows a clean "Em breve" message with a link back to Landing.
 */
export function StubPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 text-center">
      <div className="animate-fade-in-up">
        <span className="text-4xl mb-6 block">🚧</span>

        <h1 className="text-xl font-semibold text-[var(--color-text)] mb-2">
          {title}
        </h1>

        <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm">
          Esta página está sendo construída com muito cuidado.
          <br />
          Em breve estará disponível.
        </p>

        <Link
          to={ROUTES.LANDING}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all duration-200 ease-out no-underline"
        >
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}
