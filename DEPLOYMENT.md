# 🚀 Deploying to Cloudflare Pages — Step by Step

This app uses **Cloudflare Pages** (for hosting) + **Cloudflare D1** (SQLite database).
Everything runs on Cloudflare's free tier.

---

## 0. Prerequisites
- A free **Cloudflare account** → https://dash.cloudflare.com/sign-up
- **Node.js 18+** installed on your computer
- The project files (this folder)

Open a terminal **inside this project folder** and install dependencies:
```bash
npm install
```

---

## 1. Log in to Cloudflare (Wrangler)
```bash
npx wrangler login
```
A browser window opens — click **Allow**. (If you're on a headless server, use an
API token instead: `export CLOUDFLARE_API_TOKEN=xxxxx`.)

Verify:
```bash
npx wrangler whoami
```

---

## 2. Create the Pages project
```bash
npx wrangler pages project create webapp --production-branch main
```
> You can use any name instead of `webapp`. If you do, replace `webapp`
> **everywhere** below and inside `wrangler.jsonc` (`"name"` field) and
> `package.json` (`deploy:prod` script).

---

## 3. Create the D1 database
```bash
npx wrangler d1 create webapp-production
```
This prints something like:
```
[[d1_databases]]
binding = "DB"
database_name = "webapp-production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
**Copy the `database_id`** and paste it into `wrangler.jsonc`, replacing
`"local-placeholder-id"`:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "webapp-production",
    "database_id": "PASTE-YOUR-REAL-ID-HERE"
  }
]
```

---

## 4. Create the database tables (run migrations on the REMOTE db)
```bash
npx wrangler d1 migrations apply webapp-production --remote
```

### Create the admin account (production)
```bash
npx wrangler d1 execute webapp-production --remote --file=./seed.sql
```
This creates admin **username: `admin`, password: `admin123`**.
> 🔐 **Change the admin password before real use** — see section 8.

---

## 5. Build the site
```bash
npm run build
```
This creates the `dist/` folder that Cloudflare serves.

---

## 6. Deploy 🎉
```bash
npx wrangler pages deploy dist --project-name webapp
```
Wrangler prints your live URL, e.g.:
```
✨ Deployment complete! https://webapp-xxx.pages.dev
```

Open it — you'll see the login page. Sign up, go to **Play**, copy your link
(`https://webapp-xxx.pages.dev/<yourname>`), and share it!

Log in as `admin` / `admin123` and visit **`/admin`** to see every account,
message, captured photo, and sender data.

---

## 7. (Optional) Redeploy after changes
Any time you edit the code:
```bash
npm run build
npx wrangler pages deploy dist --project-name webapp
```
One-liner shortcut:
```bash
npm run deploy:prod
```

---

## 8. 🔐 Change the admin password (recommended)
Pick a new password, then generate its hash (must match the app's salt):
```bash
node -e "const c=require('crypto');console.log(c.createHash('sha256').update('ngl_salt_v1::YOUR_NEW_PASSWORD').digest('hex'))"
```
Copy the printed hash and update the admin row:
```bash
npx wrangler d1 execute webapp-production --remote \
  --command="UPDATE users SET password='PASTE_HASH_HERE' WHERE username_lower='admin'"
```
Now log in with `admin` + `YOUR_NEW_PASSWORD`.

---

## 9. (Optional) Custom domain
In the Cloudflare dashboard → **Workers & Pages → webapp → Custom domains →
Set up a custom domain**, then follow the DNS instructions.

---

## Troubleshooting
| Problem | Fix |
|--------|-----|
| `D1_ERROR: no such table` | You forgot step 4 (`migrations apply --remote`). |
| Login works but data resets | You migrated `--local` instead of `--remote`. |
| Camera doesn't open on the live site | Camera requires **HTTPS** — `.pages.dev` is HTTPS, so it works. Make sure the visitor **Allows** camera. |
| Location shows "Unknown" locally | Real geo comes from Cloudflare in production; local dev has no geo. |
| `project not found` on deploy | Run step 2, or check the `--project-name` matches. |

---

### Summary of the 6 core commands
```bash
npm install
npx wrangler login
npx wrangler d1 create webapp-production      # paste id into wrangler.jsonc
npx wrangler d1 migrations apply webapp-production --remote
npx wrangler d1 execute webapp-production --remote --file=./seed.sql
npm run build && npx wrangler pages deploy dist --project-name webapp
```
