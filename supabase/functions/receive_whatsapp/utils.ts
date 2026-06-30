export function sendSuccess(message: string = 'OK') {
  return new Response(message, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}

export function sendError(message: string, status: number = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
