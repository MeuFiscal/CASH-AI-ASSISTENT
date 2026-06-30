
export function verifyWebhook(req: Request): Response {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const verifyToken = Deno.env.get('META_VERIFY_TOKEN');

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook validado com sucesso. Lendo token:', verifyToken);
    return new Response(challenge || '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } else {
    console.warn('Falha na validação do Webhook. Recebido:', token, 'Esperado:', verifyToken);
    return new Response('Forbidden', { status: 403 });
  }
}
