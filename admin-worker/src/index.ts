interface Env {
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
  GITHUB_TOKEN: string;
  AUTH_RATE_LIMIT: KVNamespace;
}

const REPOSITORY = 'ytb1124/ytb1124.github.io';
const BRANCH = 'main';
const DOCUMENT_PATHS = [
  'content/site.json',
  'content/projects.json',
  'content/korean.json',
  'content/project-summaries.json',
  'content/activities.json',
  'content/music-production.json',
] as const;
const ALLOWED_ORIGINS = new Set(['https://taebin.link', 'https://www.taebin.link', 'http://localhost:3000', 'http://localhost:5173']);
const encoder = new TextEncoder();

function corsHeaders(request: Request) {
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://taebin.link',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-CSRF',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    Vary: 'Origin',
  };
}

function json(request: Request, value: unknown, status = 200, extra: HeadersInit = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...corsHeaders(request), ...extra },
  });
}

function base64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

async function createSession(env: Env) {
  const csrf = base64Url(crypto.getRandomValues(new Uint8Array(24)));
  const payload = base64Url(encoder.encode(JSON.stringify({ sub: env.ADMIN_USERNAME, exp: Date.now() + 12 * 60 * 60 * 1000, csrf })));
  return { token: `${payload}.${await hmac(payload, env.SESSION_SECRET)}`, csrf };
}

function cookieValue(request: Request, name: string) {
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return match?.slice(name.length + 1) || '';
}

async function readSession(request: Request, env: Env) {
  const token = cookieValue(request, 'taebin_admin');
  const [payload, signature] = token.split('.');
  if (!payload || !signature || signature !== await hmac(payload, env.SESSION_SECRET)) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload))) as { sub: string; exp: number; csrf: string };
    if (data.sub !== env.ADMIN_USERNAME || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

async function verifyPassword(password: string, stored: string) {
  const [iterationsText, saltText, hashText] = stored.split(':');
  const iterations = Number(iterationsText);
  if (!iterations || !saltText || !hashText) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: decodeBase64Url(saltText), iterations }, key, 256));
  const expected = decodeBase64Url(hashText);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
  return difference === 0;
}

async function github(env: Env, path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'taebin-link-admin',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${await response.text()}`);
  return response.json<any>();
}

async function currentRevision(env: Env) {
  const reference = await github(env, `/git/ref/heads/${BRANCH}`);
  return reference.object.sha as string;
}

async function loadDocuments(env: Env) {
  const revision = await currentRevision(env);
  const entries = await Promise.all(DOCUMENT_PATHS.map(async (path) => {
    const file = await github(env, `/contents/${path}?ref=${revision}`);
    const decoded = new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\n/g, '')), (character) => character.charCodeAt(0)));
    return [path, JSON.parse(decoded)] as const;
  }));
  return { revision, documents: Object.fromEntries(entries) };
}

type SaveBody = {
  revision: string;
  documents: Record<string, unknown>;
  assets?: { path: string; base64: string }[];
  deletions?: string[];
};

async function saveDocuments(env: Env, body: SaveBody) {
  const latestRevision = await currentRevision(env);
  if (body.revision !== latestRevision) throw new Error('CONFLICT');
  if (!body.documents || DOCUMENT_PATHS.some((path) => !(path in body.documents))) throw new Error('INVALID_DOCUMENTS');

  const commit = await github(env, `/git/commits/${latestRevision}`);
  const treeEntries: { path: string; mode: '100644'; type: 'blob'; sha: string | null }[] = [];

  for (const path of DOCUMENT_PATHS) {
    const content = JSON.stringify(body.documents[path], null, 2) + '\n';
    if (content.length > 2_000_000) throw new Error('DOCUMENT_TOO_LARGE');
    const blob = await github(env, '/git/blobs', { method: 'POST', body: JSON.stringify({ content, encoding: 'utf-8' }) });
    treeEntries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  for (const asset of body.assets || []) {
    if (!/^public\/uploads\/[a-zA-Z0-9._/-]+$/.test(asset.path) || asset.base64.length > 12_000_000) throw new Error('INVALID_ASSET');
    const blob = await github(env, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: asset.base64, encoding: 'base64' }) });
    treeEntries.push({ path: asset.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  for (const path of body.deletions || []) {
    if (!/^public\/uploads\/[a-zA-Z0-9._/-]+$/.test(path)) throw new Error('INVALID_DELETION');
    treeEntries.push({ path, mode: '100644', type: 'blob', sha: null });
  }

  const tree = await github(env, '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree: treeEntries }) });
  const nextCommit = await github(env, '/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message: 'Update portfolio content from admin', tree: tree.sha, parents: [latestRevision] }),
  });
  await github(env, `/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: nextCommit.sha, force: false }) });
  return nextCommit.sha as string;
}

function clientIp(request: Request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) });
    const origin = request.headers.get('Origin');
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json(request, { error: 'Origin not allowed' }, 403);
    const { pathname } = new URL(request.url);

    try {
      if (pathname === '/health') return json(request, { ok: true });

      if (pathname === '/login' && request.method === 'POST') {
        const ip = clientIp(request);
        const key = `login:${ip}`;
        const attempts = Number(await env.AUTH_RATE_LIMIT.get(key) || '0');
        if (attempts >= 5) return json(request, { error: '잠시 후 다시 시도해주세요.' }, 429);
        const body = await request.json<{ username?: string; password?: string }>();
        const valid = body.username === env.ADMIN_USERNAME && await verifyPassword(body.password || '', env.ADMIN_PASSWORD_HASH);
        if (!valid) {
          await env.AUTH_RATE_LIMIT.put(key, String(attempts + 1), { expirationTtl: 900 });
          return json(request, { error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, 401);
        }
        await env.AUTH_RATE_LIMIT.delete(key);
        const session = await createSession(env);
        return json(request, { ok: true, csrf: session.csrf }, 200, {
          'Set-Cookie': `taebin_admin=${session.token}; Domain=taebin.link; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`,
        });
      }

      if (pathname === '/logout' && request.method === 'POST') {
        return json(request, { ok: true }, 200, { 'Set-Cookie': 'taebin_admin=; Domain=taebin.link; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
      }

      const session = await readSession(request, env);
      if (!session) return json(request, { error: '로그인이 필요합니다.' }, 401);
      if (pathname === '/session' && request.method === 'GET') return json(request, { authenticated: true, csrf: session.csrf });
      if (request.method !== 'GET' && request.headers.get('X-Admin-CSRF') !== session.csrf) return json(request, { error: '잘못된 요청입니다.' }, 403);

      if (pathname === '/content' && request.method === 'GET') return json(request, await loadDocuments(env));
      if (pathname === '/content' && request.method === 'PUT') {
        const body = await request.json<SaveBody>();
        const revision = await saveDocuments(env, body);
        return json(request, { ok: true, revision });
      }
      return json(request, { error: 'Not found' }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message === 'CONFLICT') return json(request, { error: '다른 변경 사항이 먼저 반영되었습니다. 새로고침 후 다시 수정해주세요.' }, 409);
      console.error(error);
      return json(request, { error: '저장 중 오류가 발생했습니다.' }, 500);
    }
  },
};
