const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: {'Content-Type': 'application/json'},
    })

function isAuthed(request, env) {
    const auth = request.headers.get('Authorization') || ''
    return Boolean(env.ADMIN_PASSWORD) && auth === `Bearer ${env.ADMIN_PASSWORD}`
}

export default {
    async fetch(request, env) {
        const {pathname} = new URL(request.url)
        const method = request.method

        if (pathname === '/api/content' && method === 'GET') {
            const row = await env.DB.prepare(
                'SELECT json FROM content WHERE id = 1'
            ).first()
            return new Response(row ? row.json : 'null', {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            })
        }

        if (pathname === '/api/content' && method === 'PUT') {
            if (!isAuthed(request, env)) return json({error: 'unauthorized'}, 401)
            const body = await request.text()
            JSON.parse(body)
            await env.DB.prepare(
                `INSERT INTO content (id, json, updated_at)
                 VALUES (1, ?, datetime('now')) ON CONFLICT(id) DO
                UPDATE
                    SET json = excluded.json, updated_at = excluded.updated_at`
            )
                .bind(body)
                .run()
            return json({ok: true})
        }

        if (pathname === '/api/login' && method === 'POST') {
            return isAuthed(request, env)
                ? json({ok: true})
                : json({error: 'unauthorized'}, 401)
        }

        if (pathname === '/api/upload' && method === 'POST') {
            if (!isAuthed(request, env)) return json({error: 'unauthorized'}, 401)
            const {data, mime} = await request.json()
            const id = crypto.randomUUID()
            await env.DB.prepare(
                'INSERT INTO images (id, mime, data) VALUES (?, ?, ?)'
            )
                .bind(id, mime, data)
                .run()
            return json({url: `/img/${id}`})
        }

        if (pathname.startsWith('/img/') && method === 'GET') {
            const id = pathname.slice(5)
            const row = await env.DB.prepare(
                'SELECT mime, data FROM images WHERE id = ?'
            )
                .bind(id)
                .first()
            if (!row) return new Response('Not found', {status: 404})
            const bytes = Uint8Array.from(atob(row.data), (c) => c.charCodeAt(0))
            return new Response(bytes, {
                headers: {
                    'Content-Type': row.mime,
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            })
        }

        return env.ASSETS.fetch(request)
    },
}