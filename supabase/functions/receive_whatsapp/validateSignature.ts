export async function validateSignature(req: Request, rawBody: string): Promise<boolean> {
  const signature = req.headers.get('x-hub-signature-256');
  if (!signature) {
    return false;
  }

  const appSecret = Deno.env.get('META_APP_SECRET');
  // Se não houver APP SECRET configurado, no caso de desenvolvimento, assumiremos verdadeiro
  // Porém a especificação pede para validar. Caso não exista, falhamos por segurança.
  if (!appSecret) {
    console.error('META_APP_SECRET não configurado para validar assinatura.');
    return false;
  }

  // A assinatura vem no formato "sha256=..."
  const signatureHash = signature.replace('sha256=', '');

  const encoder = new TextEncoder();
  const keyData = encoder.encode(appSecret);
  const data = encoder.encode(rawBody);

  try {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify', 'sign']
    );

    const expectedBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
    
    // Converter ArrayBuffer para string hex
    const expectedHash = Array.from(new Uint8Array(expectedBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return expectedHash === signatureHash;
  } catch (err) {
    console.error('Erro ao validar assinatura HMAC:', err);
    return false;
  }
}
