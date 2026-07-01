import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, UserStatus } from '@/types/models';
import type { Session } from '@supabase/supabase-js';
import { bootstrapUser } from '@/services/bootstrap/bootstrapUser';
import { PremiumLoader } from '@/features/auth/components/PremiumLoader';

export type GlobalRole = 'super_admin' | 'admin' | 'support' | 'user';

interface AuthContextType {
  user: User | null;
  globalRole: GlobalRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [globalRole, setGlobalRole] = useState<GlobalRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: Session | null) => {
    if (session?.user) {
      try {
        // Bootstrap the user infrastructure before considering them fully logged in
        await bootstrapUser(session.user.id, session.user.email, session.user.user_metadata?.name);
        
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Usuário',
          phone: session.user.user_metadata?.phone || session.user.phone || '',
          address: session.user.user_metadata?.address || '',
          avatarUrl: session.user.user_metadata?.avatar_url || '',
          whatsapp: session.user.user_metadata?.whatsapp || '',
          whatsappConnected: !!session.user.user_metadata?.whatsapp,
          status: (session.user.user_metadata?.status as UserStatus) || 'ACTIVE',
          onboardingCompleted: true,
          firstAccess: false,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at,
        };

        const adminEmail = import.meta.env.VITE_BOOTSTRAP_ADMIN_EMAIL;
        let role: GlobalRole = 'user';

        if (adminEmail && session.user.email === adminEmail) {
          try {
            await supabase.rpc('bootstrap_super_admin');
          } catch (e) {
            console.error('Error in bootstrap super admin', e);
          }
        }

        try {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (roleData && !roleError) {
            role = roleData.role as GlobalRole;
          }
        } catch (e) {
          console.error('Error fetching global role', e);
        }

        setUser(mappedUser);
        setGlobalRole(role);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error in bootstrap during session load', err);
        setUser(null);
        setGlobalRole(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setGlobalRole(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    // Limpar estados globais, realtime e caches
    setUser(null);
    setGlobalRole(null);
    setIsAuthenticated(false);
    
    // Encerra todos os canais do realtime ativos
    supabase.removeAllChannels();
    
    await supabase.auth.signOut();
    
    // Forçar redirecionamento limpando qualquer estado em memória do React
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, globalRole, isAuthenticated, isLoading, logout }}>
      {isLoading ? <PremiumLoader /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
