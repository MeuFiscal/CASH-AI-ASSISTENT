import { supabase } from '@/lib/supabase';


export interface RegisterUserData {
  email: string;
  password?: string;
  name: string;
}

export async function registerUser(data: RegisterUserData) {
  try {
    if (!data.password || data.password.length < 10) {
      return { success: false, error: 'A senha deve ter pelo menos 10 caracteres.' };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          onboarding_completed: false,
        }
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('Usuário não foi criado corretamente.');
    }

    return { success: true, user: authData.user };
  } catch (err: any) {
    console.error('Error in registerUser:', err);
    if (err.message?.includes('already registered') || err.message?.includes('já cadastrado')) {
      return { success: false, error: 'already_registered' };
    }
    return { success: false, error: err.message };
  }
}
