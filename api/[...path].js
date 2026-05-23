/**
 * Vercel serverless proxy: forwards /api/* to BACKEND_URL (Render/Railway Spring API).
 */
export const config = { runtime: 'edge' };

const HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
]);

export default async function handler(request) {
  const raw = process.env.BACKEND_URL;
  const backend = raw ? raw.replace(/\/$/, '') : '';
  if (!backend) {
    return Response.json(
      {
        message:
          'Server misconfiguration: set BACKEND_URL on Vercel to your Spring API URL (e.g. https://swms-backend.onrender.com)',
      },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const target = `${backend}${url.pathname}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (HOP.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const buf = await request.arrayBuffer();
    if (buf.byteLength) init.body = buf;
  }

  try {
    const upstream = await fetch(target, init);
    const out = new Headers(upstream.headers);
    out.delete('transfer-encoding');
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: out,
    });
  } catch {
    return Response.json(
      {
        message:
          'Backend unreachable. Deploy the API (see render.yaml), then set BACKEND_URL on Vercel to that URL.',
      },
      { status: 502 }
    );
  }
}
