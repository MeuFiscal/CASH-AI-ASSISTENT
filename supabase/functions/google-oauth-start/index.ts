import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info' };
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const auth = req.headers.get('Authorization');
    if (!auth) throw new Error('Sessão ausente');
    const url = Deno.env.get('SUPABASE_URL')!;
    const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
    const { data: { user }, error } = await userClient.auth.getUser();
    if (error || !user) throw new Error('Sessão inválida');
    const { data: member } = await userClient.from('workspace_members').select('workspace_id').eq('user_id', user.id).limit(1).maybeSingle();
    if (!member) throw new Error('Workspace não encontrado');
    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const state = crypto.randomUUID();
    const { error: stateError } = await admin.from('oauth_states').insert({ state, user_id: user.id, workspace_id: member.workspace_id, expires_at: new Date(Date.now() + 10 * 60_000).toISOString() });
    if (stateError) throw stateError;
    const params = new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID')!, redirect_uri: Deno.env.get('GOOGLE_REDIRECT_URI')!, response_type: 'code',
      access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true', state,
      scope: ['openid','email','profile','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/drive.readonly','https://www.googleapis.com/auth/gmail.readonly'].join(' '),
    });
    return Response.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` }, { headers: cors });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : 'Erro OAuth' }, { status: 400, headers: cors }); }
});
