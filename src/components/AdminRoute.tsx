import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';

/**
 * AdminRoute
 * Protects administrative routes by checking globalRole.
 * If user is not super_admin or admin, redirects to user dashboard.
 */
export function AdminRoute() {
  const { user, globalRole, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // The AuthProvider handles loading state
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (globalRole !== 'super_admin' && globalRole !== 'admin') {
    // Regular user trying to access admin area
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0B1221] p-6 text-center text-white">
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold text-[#F59E0B]">Oops!</h1>
        <p className="text-[#A8B3CF]">Algo deu errado ao carregar o Centro de Operações.</p>
        <button 
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#F59E0B] px-6 py-2 font-medium text-black transition-colors hover:bg-[#D97706]"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
