import { DEFAULT_PORTFOLIO_CONTENT } from '../src/data/portfolioData';

interface D1Statement {
  bind(...values: (string | number)[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB: D1Database;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
  SITE_ORIGIN?: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const SESSION_COOKIE = 'portfolio_admin';

function jsonResponse(body: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function base64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized + '='.repeat((4 - (normalized.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(value),
  );
  return base64Url(new Uint8Array(signature));
}

async function constantTimeEqual(left: string, right: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(left)),
    crypto.subtle.digest('SHA-256', encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}

async function isAuthenticated(request: Request, secret: string | undefined): Promise<boolean> {
  if (!secret) return false;
  const cookie = request.headers.get('Cookie');
  const value = cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!value) return false;

  const [expiresAt, nonce, signature, ...rest] = value.split('.');
  if (!expiresAt || !nonce || !signature || rest.length > 0) return false;
  const expiry = Number(expiresAt);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  try {
    const expected = await sign(`${expiresAt}.${nonce}`, secret);
    const expectedBytes = fromBase64Url(expected);
    const actualBytes = fromBase64Url(signature);
    if (expectedBytes.length !== actualBytes.length) return false;
    let difference = 0;
    for (let index = 0; index < expectedBytes.length; index += 1) {
      difference |= expectedBytes[index] ^ actualBytes[index];
    }
    return difference === 0;
  } catch {
    return false;
  }
}

function isSameOrigin(request: Request, configuredOrigin: string | undefined): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  const requestUrl = new URL(request.url);
  if (origin === requestUrl.origin || origin === configuredOrigin) return true;
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }
  return (
    (requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1') &&
    originUrl.hostname === requestUrl.hostname
  );
}

async function ensureContent(db: D1Database): Promise<string> {
  const row = await db
    .prepare('SELECT document FROM site_content WHERE id = 1')
    .first<{ document: string }>();
  if (row) {
    const stored: unknown = JSON.parse(row.document);
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
      throw new Error('Stored site content is not a JSON object.');
    }
    const storedContent = stored as Record<string, unknown>;
    const storedCopy =
      storedContent.pageCopy &&
      typeof storedContent.pageCopy === 'object' &&
      !Array.isArray(storedContent.pageCopy)
        ? storedContent.pageCopy
        : {};
    const normalized = {
      ...DEFAULT_PORTFOLIO_CONTENT,
      ...storedContent,
      pageCopy: {
        ...DEFAULT_PORTFOLIO_CONTENT.pageCopy,
        ...storedCopy,
      },
    };
    if (!isContentDocument(normalized)) {
      throw new Error('Stored site content is missing required sections.');
    }
    const document = JSON.stringify(normalized);
    if (document !== row.document) {
      await db
        .prepare('UPDATE site_content SET document = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1')
        .bind(document)
        .run();
    }
    return document;
  }

  const document = JSON.stringify(DEFAULT_PORTFOLIO_CONTENT);
  await db
    .prepare(
      'INSERT INTO site_content (id, document) VALUES (1, ?) ON CONFLICT(id) DO NOTHING',
    )
    .bind(document)
    .run();
  const inserted = await db
    .prepare('SELECT document FROM site_content WHERE id = 1')
    .first<{ document: string }>();
  if (!inserted) throw new Error('Could not initialize site content in D1.');
  return inserted.document;
}

function isContentDocument(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const content = value as Record<string, unknown>;
  return (
    !!content.profile &&
    typeof content.profile === 'object' &&
    Array.isArray(content.projects) &&
    Array.isArray(content.services) &&
    Array.isArray(content.certificates) &&
    Array.isArray(content.skills) &&
    Array.isArray(content.experience) &&
    !!content.pageCopy &&
    typeof content.pageCopy === 'object' &&
    Array.isArray(content.stats) &&
    Array.isArray(content.paths) &&
    Array.isArray(content.technologies) &&
    !!content.assets &&
    typeof content.assets === 'object'
  );
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname === '/api/content' && request.method === 'GET') {
    try {
      const document = await ensureContent(env.DB);
      return new Response(document, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    } catch (error) {
      console.error('Failed to load site content from D1:', error);
      return jsonResponse({ error: 'Content storage is unavailable.' }, 503);
    }
  }

  if (pathname === '/api/auth/session' && request.method === 'GET') {
    return jsonResponse({
      authenticated: await isAuthenticated(request, env.SESSION_SECRET),
    });
  }

  if (pathname === '/api/auth/login' && request.method === 'POST') {
    if (!isSameOrigin(request, env.SITE_ORIGIN)) {
      return jsonResponse({ error: 'Cross-origin request rejected.' }, 403);
    }
    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
      return jsonResponse({ error: 'Admin authentication is not configured.' }, 503);
    }
    let body: { password?: unknown };
    try {
      const bodyText = await request.text();
      if (new TextEncoder().encode(bodyText).length > 5_000) {
        return jsonResponse({ error: 'Login request is too large.' }, 413);
      }
      body = JSON.parse(bodyText) as { password?: unknown };
    } catch {
      return jsonResponse({ error: 'Invalid JSON body.' }, 400);
    }
    if (
      typeof body.password !== 'string' ||
      !(await constantTimeEqual(body.password, env.ADMIN_PASSWORD))
    ) {
      return jsonResponse({ error: 'Incorrect password.' }, 401);
    }

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
    const nonce = base64Url(crypto.getRandomValues(new Uint8Array(24)));
    const payload = `${expiresAt}.${nonce}`;
    const signature = await sign(payload, env.SESSION_SECRET);
    const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
    return jsonResponse(
      { authenticated: true },
      200,
      {
        'Set-Cookie': `${SESSION_COOKIE}=${payload}.${signature}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}${secure}`,
      },
    );
  }

  if (pathname === '/api/auth/logout' && request.method === 'POST') {
    if (!isSameOrigin(request, env.SITE_ORIGIN)) {
      return jsonResponse({ error: 'Cross-origin request rejected.' }, 403);
    }
    return jsonResponse(
      { authenticated: false },
      200,
      {
        'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`,
      },
    );
  }

  if (pathname === '/api/content' && request.method === 'PUT') {
    if (!isSameOrigin(request, env.SITE_ORIGIN)) {
      return jsonResponse({ error: 'Cross-origin request rejected.' }, 403);
    }
    if (!(await isAuthenticated(request, env.SESSION_SECRET))) {
      return jsonResponse({ error: 'Authentication required.' }, 401);
    }
    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > 1_000_000) {
      return jsonResponse({ error: 'Content exceeds the 1 MB limit.' }, 413);
    }
    let body: unknown;
    try {
      const bodyText = await request.text();
      if (new TextEncoder().encode(bodyText).length > 1_000_000) {
        return jsonResponse({ error: 'Content exceeds the 1 MB limit.' }, 413);
      }
      body = JSON.parse(bodyText) as unknown;
    } catch {
      return jsonResponse({ error: 'Invalid JSON body.' }, 400);
    }
    if (!isContentDocument(body)) {
      return jsonResponse({ error: 'The site content document is incomplete.' }, 400);
    }
    const document = JSON.stringify(body);
    if (new TextEncoder().encode(document).length > 1_000_000) {
      return jsonResponse({ error: 'Content exceeds the 1 MB limit.' }, 413);
    }
    try {
      await env.DB.prepare(
        'INSERT INTO site_content (id, document, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET document = excluded.document, updated_at = CURRENT_TIMESTAMP',
      )
        .bind(document)
        .run();
      return jsonResponse({ saved: true });
    } catch (error) {
      console.error('Failed to save site content to D1:', error);
      return jsonResponse({ error: 'Could not save content to D1.' }, 503);
    }
  }

  if (pathname.startsWith('/api/')) {
    return jsonResponse({ error: 'API route not found.' }, 404);
  }
  return env.ASSETS.fetch(request);
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleApi(request, env);
  },
};
