# NGL — Anonymous Q&A (Cloudflare Pages + Hono + D1)

An NGL-style anonymous messaging web app. Users sign up, get a personal link
(`<your-site>/<username>`), and receive anonymous messages. A human-verification
(camera + face detection) captcha protects the send flow, and an admin dashboard
shows every account, every message, the captured photo, and sender metadata.

## ✅ Completed Features

### Accounts (frontend)
- **Login / Sign up** with username + password only (SHA-256 hashed, cookie session).
- After login → **Play** and **Inbox** tabs (design copied from the provided screenshots).

### Play tab
- Blurred profile card, **"send me anonymous messages!"**, editable profile picture (pencil).
- **Step 1: Copy your link** → shows `<web-url>/<username>` (replaces the old `NGL.LINK/...`).
- **Step 2: Share!** (native share / copy fallback).
- Profile picture change → reflected on the card **and** on the public link page.

### Public link page `/<username>`
- Exact NGL send layout: gradient background, message card, `🔒 anonymous q&a`, black **Send!** button.
- **Animated random placeholder questions** (fade in/out): *How tall r u?*, *Are u talking to anyone??*,
  *do you prefer texting or facetime?*, *do u believe in second chances?*, *are u single?*,
  *do you like anyone right now?*, *wyd later?*
- While typing, placeholder disappears (no fade) and only the typed text shows in **#000000**.
  When the field is emptied, questions return with a fade.
- **🎲 dice** button types a random question instantly (no animation).
- **Animated "Get your own messages!"** button (pulse).
- **"👇 (n) friends just tapped the button 👇"** counter that ticks up/down bit-by-bit every 0.5s.

### Human verification (captcha)
- When the user starts typing, a **"☐ I'm not a robot"** box appears under **Send!**.
- Clicking it shows a fast loading spinner → **"Verify you're human"** camera modal.
- The camera view has a **fixed, non-moving, centered head-outline trace** (dashed oval) with
  **face-alignment dots** (eyes, eyebrows, nose bridge/tip, lips, jaw/chin) so the user knows
  exactly where to line up their head. The trace stays perfectly still in the center.
- Under the camera, four short checks — **Face / Eyes / Nose / Lips** — turn green as the app
  confirms your face is centered inside the outline and fully visible (MediaPipe FaceMesh, with a
  heuristic fallback). Wording no longer uses the word "detected".
- When all four are green & stable, it **auto-captures the photo**, the box becomes
  **"✓ I'm not a robot"**, and Send is enabled.
- If the box is unchecked / not verified, the message **cannot** be sent.
- If camera permission is **denied**, a **tutorial screen** explains how to enable the camera, then Reload.

### Login password show/hide
- The **Password** field has an **eye icon** on the right. Tap it to **show** the password
  (icon becomes an eye-with-slash) and tap again to **hide** it.

### No-profile avatar
- When a user has **no profile picture**, the app shows a clean **gray circle with a light-gray
  user silhouette** (no emoji) — on the login card, the Play card, the profile-picture modal,
  the public send page, and the admin dashboard.

### Sender metadata (captured before send)
- **software** (OS from user-agent), **carrier/isp**, **sent from** (Instagram/Web Browser/etc.),
  **location** (internet/IP based via Cloudflare geo + client fallback), **time sent**.

### Inbox + Reply + Sender Hints
- Inbox list styled like the screenshot (unread = red gradient, "New Message!", time-ago).
- Tap a message → **reply screen** (gradient header card, white body, color wheel + camera, **see hints** / **reply**).
- **see hints** → **Sender Hints (PRO)** screen with **only Location (map)** + **Phone** section
  (software, carrier/isp, sent from, time sent). Profile & Friends sections removed as requested.

### Admin `/admin`
- Visible only to the `admin` account. Lists **every account**; select one to see all its messages with the
  **captured photo**, software, carrier/isp, sent from, location (map link), IP, and time sent.

## 🔗 Functional URLs
| Path | Description |
|------|-------------|
| `/` | Login / Sign up (redirects to `/dashboard` if logged in) |
| `/dashboard` | Play + Inbox (auth required) |
| `/<username>` | Public anonymous-message send page |
| `/admin` | Admin dashboard (admin only) |
| `POST /api/signup` `/api/login` `/api/logout` | Auth |
| `GET /api/me` | Current user |
| `POST /api/profile-pic` | Update profile picture |
| `GET /api/user/:username` | Public user info |
| `POST /api/send/:username` | Send anonymous message (requires captured photo) |
| `GET /api/inbox` `/api/message/:id` | Inbox / read message |
| `GET /api/admin/accounts` `/api/admin/account/:id` | Admin data |

## 🗄️ Data Architecture
- **Storage:** Cloudflare **D1** (SQLite). Tables: `users`, `sessions`, `messages`.
- Captured photo + sender metadata stored on each `messages` row (photo as base64).
- **Sessions:** HttpOnly cookie token.

## 👤 Default admin
- Username **`admin`**, password **`admin123`** (seeded). **Change this in production.**

## 🚀 Local development
```bash
npm install
npm run build
npm run db:migrate:local      # apply schema to local D1
npm run db:seed               # create admin account
pm2 start ecosystem.config.cjs
# open http://localhost:3000
```

## ☁️ Deploy to Cloudflare Pages
See **DEPLOYMENT.md** for full step-by-step instructions.

- **Platform:** Cloudflare Pages + Workers (Hono)
- **Tech:** Hono + TypeScript + Vite + D1
- **Status:** ✅ Ready to deploy
- **Last Updated:** 2026-08-05 (human-verification head-guide, password eye toggle, gray no-profile avatar)

## ⚠️ Notes on "camera captcha" & tracking
This app captures a webcam photo and IP-based location/device info from anyone who sends a message,
exactly as requested. Make sure your **Terms/Privacy** pages disclose this and that you comply with
local privacy laws (GDPR/CCPA, etc.) before going public.
