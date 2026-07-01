import { supabase } from '@/lib/supabase';


export interface RegisterUserData {
  email: string;
  password?: string;
  phone?: string;
  name: string;
}

export async function registerUser(data: RegisterUserData) {
  try {
    // Determine the email to use (supabase auth requires email or phone).
    // If they used whatsapp but no email, we could construct a dummy email or use phone auth.
    // For now, we assume email and password are provided by onboarding, or fallback to phone auth later.
    
    // We will do standard email signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || 'CashAI123!@#', // Fallback if no password provided during onboarding
      options: {
        data: {
          name: data.name,
          phone: data.phone,
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
