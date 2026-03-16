import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing url', { status: 400 });
  }

  if (!url.startsWith('https://firebasestorage.googleapis.com/')) {
    return new Response('Invalid URL', { status: 400 });
  }

  const upstream = await fetch(url);

  if (!upstream.ok) {
    return new Response('Failed to fetch image', { status: upstream.status });
  }

  const buffer = await upstream.arrayBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
