import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const app = Deno.env.get('APP_URL')!;
  try {
    const q = new URL(req.url).searchParams;
    if (q.get('error')) throw new Error(q.get('error')!);
    const code = q.get('code'); const state = q.get('state');
    if (!code || !state) throw new Error('Retorno OAuth incompleto');
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: saved } = await admin.from('oauth_states').select('*').eq('state', state).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (!saved) throw new Error('Autorização expirada');
    await admin.from('oauth_states').delete().eq('state', state);
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: Deno.env.get('GOOGLE_CLIENT_ID')!, client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!, redirect_uri: Deno.env.get('GOOGLE_REDIRECT_URI')!, grant_type: 'authorization_code' }) });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(token.error_description || 'Google recusou a autorização');
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${token.access_token}` } });
    const profile = await profileResponse.json();
    const { data: integration, error: integrationError } = await admin.from('integrations').upsert({ workspace_id: saved.workspace_id, provider: 'google', status: 'active', account_email: profile.email }, { onConflict: 'workspace_id,provider' }).select('id').single();
    if (integrationError) throw integrationError;
    const previous = await admin.from('integration_tokens').select('refresh_token').eq('integration_id', integration.id).maybeSingle();
    const { error: tokenError } = await admin.from('integration_tokens').upsert({ integration_id: integration.id, access_token: token.access_token, refresh_token: token.refresh_token || previous.data?.refresh_token, expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString() }, { onConflict: 'integration_id' });
    if (tokenError) throw tokenError;
    return Response.redirect(`${app}/superpowers?google=connected`, 302);
  } catch (e) { return Response.redirect(`${app}/superpowers?google=error&message=${encodeURIComponent(e instanceof Error ? e.message : 'Falha na conexão')}`, 302); }
});
