// Centralized server-side API factory for internal backend calls (Next API routes)
// - Derives absolute base URL from incoming headers (proto + host)
// - Forwards Cookie header
// - Defaults to no-store to avoid caching SSR fetches

export type HeadersLike = {
  get(name: string): string | null;
};

function resolveBase(h: HeadersLike) {
  const proto = h.get('x-forwarded-proto') || 'http';
  const host = h.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

export function createServerApi(h: HeadersLike) {
  const base = resolveBase(h);
  const cookie = h.get('cookie') || '';

  async function request(input: string, init?: RequestInit) {
    const url = input.startsWith('http') ? input : `${base}${input}`;
    const headers = new Headers(init?.headers);
    if (cookie && !headers.has('cookie')) headers.set('cookie', cookie);
    return fetch(url, { cache: 'no-store', ...init, headers });
  }

  async function get<T = any>(path: string, init?: RequestInit): Promise<T> {
    const res = await request(path, { ...init, method: 'GET' });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  }

  async function post<T = any>(path: string, body?: any, init?: RequestInit): Promise<T> {
    const res = await request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  }

  async function put<T = any>(path: string, body?: any, init?: RequestInit): Promise<T> {
    const res = await request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return res.json();
  }

  return { base, cookie, request, get, post, put };
}
