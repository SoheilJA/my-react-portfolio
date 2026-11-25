interface D1Statement {
  bind(...values: (string | number | ArrayBuffer | ArrayBufferView)[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface CloudflareRequest extends Request {
  cf?: {
    country?: string;
  };
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
const MAX_IMAGE_SIZE = 1_000_000;
const WEBP_MIME = 'image/webp';
const CONTENT_CACHE_CONTROL = 'public, max-age=60, stale-while-revalidate=300';

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

function isImageId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function imageCacheKey(request: Request, id: string): Request {
  return new Request(new URL(`/api/img/${id}`, request.url));
}

function contentCacheKey(request: Request): Request {
  const url = new URL('/api/content', request.url);
  return new Request(url);
}

function getPreferredLanguage(request: CloudflareRequest): 'fa' | 'en' {
  if (request.cf?.country === 'IR') return 'fa';

  const preferred = (request.headers.get('Accept-Language') || '')
    .split(',')
    .map((entry, order) => {
      const [tag, ...parameters] = entry.trim().split(';');
      const qualityParameter = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => /^q=/i.test(parameter));
      const quality = qualityParameter ? Number(qualityParameter.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), quality, order };
    })
    .filter(({ tag, quality }) => tag.length > 0 && quality > 0 && quality <= 1)
    .sort((left, right) => right.quality - left.quality || left.order - right.order)[0];

  return preferred?.tag === 'fa' || preferred?.tag.startsWith('fa-') ? 'fa' : 'en';
}

function decodeStoredImage(data: ArrayBuffer): Uint8Array {
  const bytes = new Uint8Array(data);
  if (String.fromCharCode(...bytes.subarray(0, 5)) !== 'UklGR') return bytes;

  const base64 = new TextDecoder().decode(bytes);
  const binary = atob(base64);
  const decoded = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    decoded[index] = binary.charCodeAt(index);
  }
  return decoded;
}

async function readContent(db: D1Database): Promise<string | null> {
  const row = await db
    .prepare('SELECT document FROM site_content WHERE id = 1')
    .first<{ document: string }>();
  if (!row) return null;
  const stored: unknown = JSON.parse(row.document);
  if (!isContentDocument(stored)) {
    throw new Error('Stored site content is missing required sections.');
  }
  return row.document;
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

async function handleApi(request: CloudflareRequest, env: Env): Promise<Response> {
  const requestUrl = new URL(request.url);
  const { pathname } = requestUrl;

  if (pathname === '/api/locale' && request.method === 'GET') {
    return jsonResponse(
      { lang: getPreferredLanguage(request) },
      200,
      { 'Cache-Control': 'no-store' },
    );
  }

  if (pathname === '/api/uploads' && request.method === 'POST') {
    if (!isSameOrigin(request, env.SITE_ORIGIN)) {
      return jsonResponse({ error: 'Cross-origin request rejected.' }, 403);
    }
    if (!(await isAuthenticated(request, env.SESSION_SECRET))) {
      return jsonResponse({ error: 'Authentication required.' }, 401);
    }
    if (
      request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase() !==
      WEBP_MIME
    ) {
      return jsonResponse({ error: 'Only WebP images can be uploaded.' }, 415);
    }
    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > MAX_IMAGE_SIZE) {
      return jsonResponse({ error: 'Image exceeds the 1 MB limit.' }, 413);
    }
    if (!request.body) {
      return jsonResponse({ error: 'Image body is required.' }, 400);
    }

    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_IMAGE_SIZE) {
        await reader.cancel();
        return jsonResponse({ error: 'Image exceeds the 1 MB limit.' }, 413);
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    if (
      bytes.byteLength < 12 ||
      String.fromCharCode(...bytes.subarray(0, 4)) !== 'RIFF' ||
      String.fromCharCode(...bytes.subarray(8, 12)) !== 'WEBP'
    ) {
      return jsonResponse({ error: 'The uploaded file is not a valid WebP image.' }, 415);
    }

    const id = crypto.randomUUID();
    try {
      await env.DB.prepare(
        'INSERT INTO images (id, data, mime, size) VALUES (?, ?, ?, ?)',
      )
        .bind(id, bytes, WEBP_MIME, bytes.byteLength)
        .run();
      return jsonResponse({ url: `/api/img/${id}` }, 201);
    } catch (error) {
      console.error('Failed to store uploaded image in D1:', error);
      return jsonResponse({ error: 'Could not save image to D1.' }, 503);
    }
  }

  const imageDeleteMatch = pathname.match(/^\/api\/uploads\/([^/]+)$/);
  if (imageDeleteMatch && request.method === 'DELETE') {
    if (!isSameOrigin(request, env.SITE_ORIGIN)) {
      return jsonResponse({ error: 'Cross-origin request rejected.' }, 403);
    }
    if (!(await isAuthenticated(request, env.SESSION_SECRET))) {
      return jsonResponse({ error: 'Authentication required.' }, 401);
    }
    const id = imageDeleteMatch[1];
    if (!isImageId(id)) {
      return jsonResponse({ error: 'Invalid image ID.' }, 400);
    }

    try {
      const deleted = await env.DB.prepare(
        'DELETE FROM images WHERE id = ? RETURNING id',
      )
        .bind(id)
        .first<{ id: string }>();
      if (!deleted) return jsonResponse({ error: 'Image not found.' }, 404);
      const cache = (caches as CacheStorage & { default: Cache }).default;
      await cache.delete(imageCacheKey(request, id));
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error('Failed to delete uploaded image from D1:', error);
      return jsonResponse({ error: 'Could not delete image.' }, 503);
    }
  }

  const imageMatch = pathname.match(/^\/api\/img\/([^/]+)$/);
  if (imageMatch && request.method === 'GET') {
    const id = imageMatch[1];
    if (!isImageId(id)) return jsonResponse({ error: 'Image not found.' }, 404);

    const cache = (caches as CacheStorage & { default: Cache }).default;
    const cacheKey = imageCacheKey(request, id);
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) return cachedResponse;

    try {
      const image = await env.DB.prepare(
        'SELECT data, mime FROM images WHERE id = ?',
      )
        .bind(id)
        .first<{ data: ArrayBuffer; mime: string }>();
      if (!image) return jsonResponse({ error: 'Image not found.' }, 404);

      const data = decodeStoredImage(image.data);
      const body = new ArrayBuffer(data.byteLength);
      new Uint8Array(body).set(data);
      const response = new Response(body, {
        headers: {
          'Content-Type': image.mime,
          'Content-Length': String(data.byteLength),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Content-Type-Options': 'nosniff',
        },
      });
      await cache.put(cacheKey, response.clone());
      return response;
    } catch (error) {
      console.error('Failed to load image from D1:', error);
      return jsonResponse({ error: 'Could not load image.' }, 503);
    }
  }

  if (pathname === '/api/content' && request.method === 'GET') {
    const cache = (caches as CacheStorage & { default: Cache }).default;
    const cacheKey = contentCacheKey(request);
    try {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) return cachedResponse;
    } catch (error) {
      console.error('Failed to read site content from cache:', error);
    }

    try {
      const document = await readContent(env.DB);
      if (!document) {
        return jsonResponse(
          { initialized: false, error: 'Site content has not been imported yet.' },
          404,
        );
      }
      const response = new Response(document, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': CONTENT_CACHE_CONTROL,
        },
      });
      try {
        await cache.put(cacheKey, response.clone());
      } catch (error) {
        console.error('Failed to cache site content:', error);
      }
      return response;
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
    } catch (error) {
      console.error('Failed to save site content to D1:', error);
      return jsonResponse({ error: 'Could not save content to D1.' }, 503);
    }
    try {
      const cache = (caches as CacheStorage & { default: Cache }).default;
      await cache.delete(contentCacheKey(request));
    } catch (error) {
      console.error('Content was saved, but its cache could not be invalidated:', error);
      return jsonResponse(
        { error: 'Content was saved, but its cache could not be invalidated.' },
        503,
      );
    }
    return jsonResponse({ saved: true });
  }

  if (pathname.startsWith('/api/')) {
    return jsonResponse({ error: 'API route not found.' }, 404);
  }
  return env.ASSETS.fetch(request);
}

export default {
  fetch(request: CloudflareRequest, env: Env): Promise<Response> {
    return handleApi(request, env);
  },
};
