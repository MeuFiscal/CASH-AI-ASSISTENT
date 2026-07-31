import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const auth = req.headers.get('Authorization'); if (!auth) throw new Error('Sessão ausente');
    const base = Deno.env.get('SUPABASE_URL')!;
    const client = createClient(base, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await client.auth.getUser(); if (!user) throw new Error('Sessão inválida');
    const { data: member } = await client.from('workspace_members').select('workspace_id').eq('user_id', user.id).limit(1).maybeSingle(); if (!member) throw new Error('Workspace não encontrado');
    const admin = createClient(base, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: integration } = await admin.from('integrations').select('id').eq('workspace_id', member.workspace_id).eq('provider', 'google').maybeSingle(); if (!integration) throw new Error('Google não conectado');
    const body = await req.json().catch(() => ({}));
    if (body.action === 'disconnect') {
      const { data: old } = await admin.from('integration_tokens').select('access_token').eq('integration_id', integration.id).maybeSingle();
      if (old?.access_token) await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(old.access_token)}`, { method: 'POST' }).catch(() => null);
      await admin.from('integrations').delete().eq('id', integration.id);
      return Response.json({ disconnected: true }, { headers: cors });
    }
    const { data: token } = await admin.from('integration_tokens').select('*').eq('integration_id', integration.id).single();
    let access = token.access_token;
    if (!token.expires_at || new Date(token.expires_at).getTime() < Date.now() + 60_000) {
      const refreshed = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: Deno.env.get('GOOGLE_CLIENT_ID')!, client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!, refresh_token: token.refresh_token, grant_type: 'refresh_token' }) });
      const fresh = await refreshed.json(); if (!refreshed.ok) throw new Error('Reconecte sua conta Google');
      access = fresh.access_token;
      await admin.from('integration_tokens').update({ access_token: access, expires_at: new Date(Date.now() + fresh.expires_in * 1000).toISOString() }).eq('integration_id', integration.id);
    }
    const headers = { Authorization: `Bearer ${access}` }; const workspace_id = member.workspace_id;
    const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&maxResults=250&timeMin=${encodeURIComponent(new Date(Date.now()-30*86400000).toISOString())}`, { headers });
    const cal = await calRes.json();
    for (const e of cal.items || []) {
      const start = e.start?.dateTime || `${e.start?.date}T00:00:00Z`; const end = e.end?.dateTime || `${e.end?.date}T00:00:00Z`;
      await admin.from('calendar_events').upsert({ workspace_id, source: 'google_calendar', external_id: e.id, title: e.summary || '(Sem título)', description: e.description || null, start_time: start, end_time: end, location: e.location || null, event_status: e.status === 'cancelled' ? 'canceled' : 'pending' }, { onConflict: 'workspace_id,source,external_id' });
    }
    const driveRes = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=100&orderBy=modifiedTime%20desc&fields=files(id,name,mimeType,webViewLink,modifiedTime)&q=trashed%3Dfalse', { headers });
    const drive = await driveRes.json();
    for (const f of drive.files || []) await admin.from('documents').upsert({ workspace_id, source: 'google_drive', external_id: f.id, title: f.name, file_url: f.webViewLink || `https://drive.google.com/open?id=${f.id}`, file_type: f.mimeType }, { onConflict: 'workspace_id,source,external_id' });
    const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50', { headers }); const list = await listRes.json();
    let mailCount = 0;
    for (const item of list.messages || []) {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, { headers }); const msg = await msgRes.json();
      const hs = Object.fromEntries((msg.payload?.headers || []).map((h: {name:string,value:string}) => [h.name.toLowerCase(), h.value]));
      await admin.from('google_mail_items').upsert({ workspace_id, external_id: msg.id, thread_id: msg.threadId, subject: hs.subject || '(Sem assunto)', sender: hs.from || null, received_at: hs.date ? new Date(hs.date).toISOString() : null, snippet: msg.snippet || null, is_unread: (msg.labelIds || []).includes('UNREAD') }, { onConflict: 'workspace_id,external_id' }); mailCount++;
    }
    await admin.from('integration_sync_logs').insert({ integration_id: integration.id, status: 'success', details: { calendar: (cal.items || []).length, drive: (drive.files || []).length, gmail: mailCount } });
    return Response.json({ calendar: (cal.items || []).length, drive: (drive.files || []).length, gmail: mailCount }, { headers: cors });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : 'Falha na sincronização' }, { status: 400, headers: cors }); }
});
