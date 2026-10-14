// Check the HTTP process without requiring authentication or database access.
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok' }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export function HEAD() {
  return new Response(null, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
