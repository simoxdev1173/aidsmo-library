import { GET as deliverUpload } from '@/app/uploads/[...path]/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return deliverUpload(request, context);
}
