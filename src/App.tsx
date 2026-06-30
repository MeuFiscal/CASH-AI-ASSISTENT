import { RouterProvider } from 'react-router-dom';
import { router } from '@/core/router';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * Cash AI — Root Application Component
 *
 * Composes all providers and renders the router.
 */
export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
