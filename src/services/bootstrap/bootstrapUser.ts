import { supabase } from '@/lib/supabase';

/**
 * Ensures the authenticated user has all required structural records.
 * If anything is missing, it creates them.
 * 
 * Flow:
 * - Existe Workspace?
 * - Existe Workspace Member?
 * - Existe Preferences?
 * - Existe Workspace AI?
 * - Existe Workspace Memory?
 * - Existe Subscription?
 */
export async function bootstrapUser(userId: string, _userEmail?: string, userName?: string, userPhone?: string) {
  try {
    // 1. Check if user is a member of any workspace
    const { data: members, error: memberErr } = await supabase
      .from('workspace_members')
      .select('workspace_id, role')
      .eq('user_id', userId);

    if (memberErr) throw memberErr;

    let workspaceId: string;

    if (!members || members.length === 0) {
      // 1. Generate unique slug
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const slug = `ws-${userId.substring(0, 8)}-${randomSuffix}`;

      // Create a default workspace for the user
      const defaultName = userName ? `Workspace de ${userName}` : 'Meu Workspace';
      
      const { data: wsData, error: wsErr } = await supabase
        .from('workspaces')
        .insert({
          name: defaultName,
          slug: slug,
          owner_user_id: userId,
        })
        .select('id')
        .single();

      if (wsErr || !wsData) throw wsErr || new Error('Failed to create workspace');
      workspaceId = wsData.id;

      // Add user to workspace as owner
      const { error: joinErr } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: userId,
          role: 'owner'
        });

      if (joinErr) throw joinErr;
    } else {
      // Just use the first workspace they belong to
      workspaceId = members[0].workspace_id;
    }

    // 2. Ensure AI Configuration
    const { data: aiData } = await supabase
      .from('workspace_ai')
      .select('id')
      .eq('workspace_id', workspaceId)
      .maybeSingle();

    if (!aiData) {
      await supabase.from('workspace_ai').insert({ workspace_id: workspaceId });
    }

    // 3. Ensure Subscription
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('workspace_id', workspaceId)
      .maybeSingle();

    if (!subData) {
      // Get the first available plan
      const { data: plans } = await supabase.from('plans').select('id').limit(1);
      
      if (plans && plans.length > 0) {
        await supabase.from('subscriptions').insert({ 
          workspace_id: workspaceId,
          plan_id: plans[0].id,
          status: 'TRIALING'
        });
      }
    }

    // 4. Ensure WhatsApp Contact (so webhook can route messages)
    if (userPhone) {
      // Clean phone number: remove non-digits
      const cleanPhone = userPhone.replace(/\D/g, '');
      if (cleanPhone) {
        const { data: contactData } = await supabase
          .from('whatsapp_contacts')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('phone_number', cleanPhone)
          .maybeSingle();

        if (!contactData) {
          await supabase.from('whatsapp_contacts').insert({
            workspace_id: workspaceId,
            phone_number: cleanPhone,
            name: userName || 'Usuário',
            status: 'active'
          });
        }
      }
    }

    // 5. Build Dashboard to pre-warm the views
    try {
      await supabase.rpc('build_dashboard', { p_workspace_id: workspaceId });
    } catch (e) {
      console.warn('build_dashboard call failed, ignoring.', e);
    }

    return { success: true, workspaceId };
  } catch (err: any) {
    console.error('Error in bootstrapUser:', err);
    return { success: false, error: err.message };
  }
}
