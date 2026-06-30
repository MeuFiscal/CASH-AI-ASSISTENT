import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants';

/**
 * Cash AI — Router Configuration
 *
 * Lazy-loaded routes for optimal code splitting.
 * Landing is eagerly loaded (entry point).
 * All other routes are lazy (future sprints).
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.LANDING,
    lazy: async () => {
      const { Landing } = await import('@/features/landing');
      return { Component: Landing };
    },
  },
  {
    path: ROUTES.RECURSOS,
    lazy: async () => {
      const { RecursosPage } = await import('@/features/landing');
      return { Component: RecursosPage };
    },
  },
  {
    path: ROUTES.INTEGRACOES,
    lazy: async () => {
      const { IntegracoesPage } = await import('@/features/landing');
      return { Component: IntegracoesPage };
    },
  },
  {
    path: ROUTES.PRECOS,
    lazy: async () => {
      const { PrecosPage } = await import('@/features/landing');
      return { Component: PrecosPage };
    },
  },
  {
    path: ROUTES.EMPRESA,
    lazy: async () => {
      const { EmpresaPage } = await import('@/features/landing');
      return { Component: EmpresaPage };
    },
  },
  {
    path: ROUTES.DEMO,
    lazy: async () => {
      const { DemoPage } = await import('@/features/landing');
      return { Component: DemoPage };
    },
  },
  {
    path: '/auth',
    lazy: async () => {
      const { AuthLayout } = await import('@/features/auth/AuthLayout');
      return { Component: AuthLayout };
    },
    children: [
      {
        path: 'login',
        lazy: async () => {
          const { Login } = await import('@/features/auth/Login');
          return { Component: Login };
        }
      },
      {
        path: 'forgot-password',
        lazy: async () => {
          const { ForgotPassword } = await import('@/features/auth/ForgotPassword');
          return { Component: ForgotPassword };
        }
      },
      {
        path: 'link-expired',
        lazy: async () => {
          const { LinkExpired } = await import('@/features/auth/LinkExpired');
          return { Component: LinkExpired };
        }
      },
      {
        path: 'callback',
        lazy: async () => {
          // You may not have MagicLinkCallback yet, or it's somewhere else, assuming you will adapt it if needed, or point it to a loader that navigates. For now just pointing to what was there.
          const { MagicLinkCallback } = await import('@/features/auth');
          return { Component: MagicLinkCallback };
        }
      }
    ]
  },
  {
    path: ROUTES.APP,
    lazy: async () => {
      const { AppHomePage } = await import('@/features/app');
      return { Component: AppHomePage };
    },
  },
  {
    id: 'protected-app',
    lazy: async () => {
      const { ProtectedRoute, ErrorBoundary } = await import('@/components/ProtectedRoute');
      return { Component: ProtectedRoute, ErrorBoundary };
    },
    children: [
      {
        path: ROUTES.DASHBOARD,
        lazy: async () => {
          const { Dashboard } = await import('@/features/dashboard/Dashboard');
          return { Component: Dashboard };
        }
      },
      {
        path: '/chat',
        lazy: async () => {
          const { Chat } = await import('@/features/chat');
          return { Component: Chat };
        }
      },
      {
        path: '/agenda',
        lazy: async () => {
          const { Agenda } = await import('@/features/agenda');
          return { Component: Agenda };
        }
      },
      {
        path: '/finances',
        lazy: async () => {
          const { Finances } = await import('@/features/finances');
          return { Component: Finances };
        }
      },
      {
        path: '/documents',
        lazy: async () => {
          const { Documents } = await import('@/features/documents');
          return { Component: Documents };
        }
      },
      {
        path: '/memory',
        lazy: async () => {
          const { Memory } = await import('@/features/memory');
          return { Component: Memory };
        }
      },
      {
        path: '/insights',
        lazy: async () => {
          const { Insights } = await import('@/features/insights');
          return { Component: Insights };
        }
      },
      {
        path: '/my-ai',
        lazy: async () => {
          const { MyAI } = await import('@/features/my-ai');
          return { Component: MyAI };
        }
      },
      {
        path: '/superpowers',
        lazy: async () => {
          const { Superpowers } = await import('@/features/superpowers');
          return { Component: Superpowers };
        }
      },
      {
        path: '/profile',
        lazy: async () => {
          const { Profile } = await import('@/features/profile');
          return { Component: Profile };
        }
      },
      {
        path: '/premium',
        lazy: async () => {
          const { Premium } = await import('@/features/premium');
          return { Component: Premium };
        }
      },
      {
        path: '/settings',
        lazy: async () => {
          const { Settings } = await import('@/features/settings');
          return { Component: Settings };
        }
      },
      {
        path: '/notifications',
        lazy: async () => {
          const { Notifications } = await import('@/features/notifications');
          return { Component: Notifications };
        }
      }
    ]
  },
  {
    path: '/login-transition',
    lazy: async () => {
      const { TransitionScreen } = await import('@/features/auth/TransitionScreen');
      return { Component: TransitionScreen };
    }
  },
  {
    path: ROUTES.ADMIN,
    lazy: async () => {
      const { AdminPage } = await import('@/features/admin');
      return { Component: AdminPage };
    },
  },
]);
