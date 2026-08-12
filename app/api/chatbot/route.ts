import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_LIGHTRAG_URL = 'http://188.165.162.105:9712';

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  query?: unknown;
  conversationHistory?: unknown;
};

function getStreamEndpoint(apiKey?: string) {
  const configured = (process.env.LIGHTRAG_API_URL || DEFAULT_LIGHTRAG_URL).trim();
  const baseUrl = configured.replace(/\/+$/, '');
  const endpoint = new URL(
    baseUrl.endsWith('/query/stream') ? baseUrl : `${baseUrl}/query/stream`,
  );

  // This LightRAG deployment exposes the API key dependency as a query
  // parameter in Swagger. Also sending X-API-Key below preserves compatibility
  // with standard LightRAG server deployments.
  if (apiKey) endpoint.searchParams.set('api_key_header_value', apiKey);
  return endpoint;
}

function isConversationHistory(value: unknown): value is ConversationMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (message) =>
        message &&
        typeof message === 'object' &&
        ((message as ConversationMessage).role === 'user' ||
          (message as ConversationMessage).role === 'assistant') &&
        typeof (message as ConversationMessage).content === 'string',
    )
  );
}

function jsonError(detail: string, status: number) {
  return NextResponse.json({ detail }, { status });
}

function readErrorDetail(detail: unknown): string | null {
  if (typeof detail === 'string') return detail;
  if (!Array.isArray(detail)) return null;

  const messages = detail
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const validationError = item as { loc?: unknown; msg?: unknown };
      if (typeof validationError.msg !== 'string') return null;
      const location = Array.isArray(validationError.loc)
        ? validationError.loc.filter((part) => part !== 'body').join('.')
        : '';
      return location ? `${location}: ${validationError.msg}` : validationError.msg;
    })
    .filter((message): message is string => Boolean(message));

  return messages.length ? messages.join(' · ') : null;
}

export async function POST(request: NextRequest) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return jsonError('The chat request must be valid JSON.', 400);
  }

  if (typeof body.query !== 'string' || body.query.trim().length < 3) {
    return jsonError('Enter a question with at least 3 characters.', 400);
  }

  if (
    body.conversationHistory !== undefined &&
    !isConversationHistory(body.conversationHistory)
  ) {
    return jsonError('Conversation history has an invalid format.', 400);
  }

  const headers: HeadersInit = {
    Accept: 'application/x-ndjson',
    'Content-Type': 'application/json',
  };
  const apiKey = process.env.LIGHTRAG_API_KEY?.trim();
  if (apiKey) headers['X-API-Key'] = apiKey;

  let upstream: Response;

  try {
    upstream = await fetch(getStreamEndpoint(apiKey), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: body.query.trim(),
        mode: process.env.LIGHTRAG_QUERY_MODE || 'mix',
        stream: true,
        include_references: true,
        include_chunk_content: false,
        response_type: 'Multiple Paragraphs',
        conversation_history: (body.conversationHistory || []).slice(-12),
      }),
      cache: 'no-store',
      signal: request.signal,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown connection error';
    return jsonError(`Could not reach the LightRAG service: ${reason}`, 502);
  }

  if (!upstream.ok) {
    let detail = `LightRAG returned HTTP ${upstream.status}.`;
    try {
      const errorBody = (await upstream.json()) as { detail?: unknown };
      detail = readErrorDetail(errorBody.detail) || detail;
    } catch {
      // Keep the status-based fallback for non-JSON upstream errors.
    }
    return jsonError(detail, upstream.status);
  }

  if (!upstream.body) {
    return jsonError('LightRAG returned an empty response stream.', 502);
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'X-Accel-Buffering': 'no',
    },
  });
}
