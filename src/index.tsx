import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { renderLogin } from './pages/login'
import { renderDashboard } from './pages/dashboard'
import { renderSend } from './pages/send'
import { renderAdmin } from './pages/admin'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// ---------- helpers ----------
function genToken() {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
}

// Simple password hashing using Web Crypto (SHA-256 with salt)
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode('ngl_salt_v1::' + password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getUserFromToken(db: D1Database, token: string | undefined) {
  if (!token) return null
  const row = await db.prepare(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`
  ).bind(token).first<any>()
  return row || null
}

function jsonError(c: any, msg: string, status = 400) {
  return c.json({ error: msg }, status)
}

// ---------- AUTH API ----------
app.post('/api/signup', async (c) => {
  const { username, password } = await c.req.json().catch(() => ({}))
  if (!username || !password) return jsonError(c, 'Username and password required')
  const uname = String(username).trim()
  if (!/^[A-Za-z0-9_]{3,20}$/.test(uname)) {
    return jsonError(c, 'Username must be 3-20 chars: letters, numbers, underscore only')
  }
  if (String(password).length < 4) return jsonError(c, 'Password must be at least 4 characters')

  const lower = uname.toLowerCase()
  if (['admin', 'api', 'static', 'login', 'dashboard', 'logout'].includes(lower)) {
    return jsonError(c, 'That username is reserved')
  }
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username_lower = ?').bind(lower).first()
  if (existing) return jsonError(c, 'Username already taken')

  const hash = await hashPassword(String(password))
  const res = await c.env.DB.prepare(
    'INSERT INTO users (username, username_lower, password) VALUES (?, ?, ?)'
  ).bind(uname, lower, hash).run()
  const userId = res.meta.last_row_id

  const token = genToken()
  await c.env.DB.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').bind(token, userId).run()
  setCookie(c, 'session', token, { path: '/', httpOnly: true, sameSite: 'Lax', maxAge: 60 * 60 * 24 * 30 })
  return c.json({ ok: true, username: uname })
})

app.post('/api/login', async (c) => {
  const { username, password } = await c.req.json().catch(() => ({}))
  if (!username || !password) return jsonError(c, 'Username and password required')
  const lower = String(username).trim().toLowerCase()
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE username_lower = ?').bind(lower).first<any>()
  if (!user) return jsonError(c, 'Invalid username or password', 401)
  const hash = await hashPassword(String(password))
  if (hash !== user.password) return jsonError(c, 'Invalid username or password', 401)

  const token = genToken()
  await c.env.DB.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').bind(token, user.id).run()
  setCookie(c, 'session', token, { path: '/', httpOnly: true, sameSite: 'Lax', maxAge: 60 * 60 * 24 * 30 })
  return c.json({ ok: true, username: user.username, is_admin: user.is_admin })
})

app.post('/api/logout', async (c) => {
  const token = getCookie(c, 'session')
  if (token) await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run()
  deleteCookie(c, 'session', { path: '/' })
  return c.json({ ok: true })
})

app.get('/api/me', async (c) => {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (!user) return jsonError(c, 'Not authenticated', 401)
  return c.json({
    username: user.username,
    profile_pic: user.profile_pic,
    is_admin: user.is_admin
  })
})

// ---------- PROFILE API ----------
app.post('/api/profile-pic', async (c) => {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (!user) return jsonError(c, 'Not authenticated', 401)
  const { image } = await c.req.json().catch(() => ({}))
  if (!image || typeof image !== 'string') return jsonError(c, 'No image')
  if (image.length > 1_500_000) return jsonError(c, 'Image too large')
  await c.env.DB.prepare('UPDATE users SET profile_pic = ? WHERE id = ?').bind(image, user.id).run()
  return c.json({ ok: true })
})

// ---------- PUBLIC: get user info for send page ----------
app.get('/api/user/:username', async (c) => {
  const lower = c.req.param('username').toLowerCase()
  const user = await c.env.DB.prepare('SELECT username, profile_pic FROM users WHERE username_lower = ?').bind(lower).first<any>()
  if (!user) return jsonError(c, 'User not found', 404)
  return c.json({ username: user.username, profile_pic: user.profile_pic })
})

// ---------- SEND MESSAGE (public, anonymous) ----------
app.post('/api/send/:username', async (c) => {
  const lower = c.req.param('username').toLowerCase()
  const user = await c.env.DB.prepare('SELECT id FROM users WHERE username_lower = ?').bind(lower).first<any>()
  if (!user) return jsonError(c, 'User not found', 404)

  const body = await c.req.json().catch(() => ({}))
  const text = String(body.body || '').trim()
  const photo = typeof body.photo === 'string' ? body.photo : null
  if (!text) return jsonError(c, 'Message is empty')
  if (text.length > 1000) return jsonError(c, 'Message too long')
  if (!photo) return jsonError(c, 'Human verification required')
  if (photo.length > 1_500_000) return jsonError(c, 'Photo too large')

  // ---- Device / network detection (server-side) ----
  const ua = c.req.header('user-agent') || ''
  const software = detectSoftware(ua)
  const sentFrom = detectSentFrom(ua)

  // IP from Cloudflare
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'

  // Cloudflare geo (available on cf object in production)
  const cf: any = (c.req.raw as any).cf || {}
  let city = cf.city || ''
  let country = cf.country || ''
  let region = cf.region || ''
  let lat = cf.latitude ? parseFloat(cf.latitude) : null
  let lon = cf.longitude ? parseFloat(cf.longitude) : null
  const carrier = cf.asOrganization || body.carrier || 'Unknown ISP'

  // Fallback: client can provide geo hints (from a client geo lookup)
  const clientGeo = body.geo || {}
  if (!city && clientGeo.city) city = clientGeo.city
  if (!country && clientGeo.country) country = clientGeo.country
  if (!region && clientGeo.region) region = clientGeo.region
  if (lat === null && clientGeo.lat != null) lat = parseFloat(clientGeo.lat)
  if (lon === null && clientGeo.lon != null) lon = parseFloat(clientGeo.lon)

  const locationParts = [city, region, country].filter(Boolean)
  const location = locationParts.length ? Array.from(new Set([city, country].filter(Boolean))).join(', ') : (clientGeo.location || 'Unknown location')
  const finalCarrier = carrier || clientGeo.carrier || 'Unknown ISP'

  await c.env.DB.prepare(
    `INSERT INTO messages (user_id, body, photo, software, carrier, sent_from, location, lat, lon, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(user.id, text, photo, software, finalCarrier, sentFrom, location, lat, lon, ip).run()

  return c.json({ ok: true })
})

function detectSoftware(ua: string): string {
  ua = ua || ''
  let m
  if ((m = ua.match(/Android\s([\d.]+)/))) return 'Android ' + m[1]
  if ((m = ua.match(/iPhone OS ([\d_]+)/))) return 'iOS ' + m[1].replace(/_/g, '.')
  if ((m = ua.match(/CPU OS ([\d_]+)/))) return 'iOS ' + m[1].replace(/_/g, '.')
  if (/Windows NT 10/.test(ua)) return 'Windows 10/11'
  if (/Windows NT/.test(ua)) return 'Windows'
  if (/Mac OS X ([\d_]+)/.test(ua)) {
    const mm = ua.match(/Mac OS X ([\d_]+)/)
    return 'macOS ' + (mm ? mm[1].replace(/_/g, '.') : '')
  }
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown OS'
}

function detectSentFrom(ua: string): string {
  ua = ua || ''
  if (/Instagram/i.test(ua)) return 'Instagram'
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'Facebook'
  if (/Snapchat/i.test(ua)) return 'Snapchat'
  if (/Twitter/i.test(ua)) return 'Twitter'
  if (/TikTok/i.test(ua)) return 'TikTok'
  return 'Web Browser'
}

// ---------- INBOX API ----------
app.get('/api/inbox', async (c) => {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (!user) return jsonError(c, 'Not authenticated', 401)
  const { results } = await c.env.DB.prepare(
    `SELECT id, body, is_read, created_at, software, carrier, sent_from, location, lat, lon
     FROM messages WHERE user_id = ? ORDER BY created_at DESC`
  ).bind(user.id).all()
  return c.json({ messages: results })
})

app.get('/api/message/:id', async (c) => {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (!user) return jsonError(c, 'Not authenticated', 401)
  const id = c.req.param('id')
  const msg = await c.env.DB.prepare(
    `SELECT * FROM messages WHERE id = ? AND user_id = ?`
  ).bind(id, user.id).first<any>()
  if (!msg) return jsonError(c, 'Not found', 404)
  await c.env.DB.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').bind(id).run()
  // Do NOT return the photo to normal users (photo is admin-only per spec)
  return c.json({
    id: msg.id,
    body: msg.body,
    created_at: msg.created_at,
    software: msg.software,
    carrier: msg.carrier,
    sent_from: msg.sent_from,
    location: msg.location,
    lat: msg.lat,
    lon: msg.lon
  })
})

// ---------- ADMIN API ----------
async function requireAdmin(c: any) {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (!user || !user.is_admin) return null
  return user
}

app.get('/api/admin/accounts', async (c) => {
  const admin = await requireAdmin(c)
  if (!admin) return jsonError(c, 'Forbidden', 403)
  const { results } = await c.env.DB.prepare(
    `SELECT u.id, u.username, u.created_at, u.is_admin,
       (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.id) as message_count
     FROM users u ORDER BY u.created_at DESC`
  ).all()
  return c.json({ accounts: results })
})

app.get('/api/admin/account/:id', async (c) => {
  const admin = await requireAdmin(c)
  if (!admin) return jsonError(c, 'Forbidden', 403)
  const id = c.req.param('id')
  const account = await c.env.DB.prepare('SELECT id, username, created_at, profile_pic FROM users WHERE id = ?').bind(id).first()
  if (!account) return jsonError(c, 'Not found', 404)
  const { results } = await c.env.DB.prepare(
    `SELECT id, body, photo, software, carrier, sent_from, location, lat, lon, ip, created_at
     FROM messages WHERE user_id = ? ORDER BY created_at DESC`
  ).bind(id).all()
  return c.json({ account, messages: results })
})

// ---------- PAGE ROUTES ----------
app.get('/', async (c) => {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (user) return c.redirect('/dashboard')
  return c.html(renderLogin())
})

app.get('/dashboard', async (c) => {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (!user) return c.redirect('/')
  return c.html(renderDashboard())
})

app.get('/admin', async (c) => {
  const user = await getUserFromToken(c.env.DB, getCookie(c, 'session'))
  if (!user || !user.is_admin) {
    return c.html(`<!doctype html><html><body style="font-family:sans-serif;text-align:center;padding-top:80px"><h2>403 — Admin only</h2><p><a href="/dashboard">Back</a></p></body></html>`, 403)
  }
  return c.html(renderAdmin())
})

// Public username send page — MUST be last (catch-all)
app.get('/:username', async (c) => {
  const raw = c.req.param('username')
  const lower = raw.toLowerCase()
  const user = await c.env.DB.prepare('SELECT username, profile_pic FROM users WHERE username_lower = ?').bind(lower).first<any>()
  if (!user) {
    return c.html(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;text-align:center;padding-top:80px;background:#111;color:#fff"><h2>User not found</h2><p>@${escapeHtml(raw)} does not exist.</p><a href="/" style="color:#ff5e00">Get your own messages!</a></body></html>`, 404)
  }
  return c.html(renderSend(user.username, user.profile_pic))
})

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string))
}

export default app
