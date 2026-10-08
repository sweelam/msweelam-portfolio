// POST /api/visitors → { visitors }
// Records the current visitor (once) and returns the site's unique visitor count.

const SITE_SLUG = 'msweelam.dev';
const ONE_YEAR = 60 * 60 * 24 * 365;

function json(body, status = 200, headers = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
    });
}

// Visitors are anonymous: a random id in an HttpOnly cookie, same scheme as the blog.
function ensureVisitor(request) {
    const cookie = request.headers.get('cookie') ?? '';
    const match = cookie.match(/(?:^|;\s*)vid=([0-9a-f-]{36})(?:;|$)/);
    if (match) return { visitor: match[1], headers: {} };
    const visitor = crypto.randomUUID();
    return {
        visitor,
        headers: { 'set-cookie': `vid=${visitor}; Path=/api; Max-Age=${ONE_YEAR}; HttpOnly; Secure; SameSite=Lax` },
    };
}

export default {
    async fetch(request, env) {
        const { pathname } = new URL(request.url);
        if (pathname !== '/api/visitors') return json({ error: 'not found' }, 404);
        if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405, { allow: 'POST' });

        const { visitor, headers } = ensureVisitor(request);
        const [, count] = await env.DB.batch([
            env.DB.prepare('INSERT OR IGNORE INTO views (slug, visitor, first_seen) VALUES (?1, ?2, ?3)').bind(
                SITE_SLUG,
                visitor,
                Date.now(),
            ),
            env.DB.prepare('SELECT COUNT(*) AS visitors FROM views WHERE slug = ?1').bind(SITE_SLUG),
        ]);

        return json({ visitors: count.results[0]?.visitors ?? 0 }, 200, headers);
    },
};
