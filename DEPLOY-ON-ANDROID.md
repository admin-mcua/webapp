# 📱 Deploy this NGL app to Cloudflare — using ONLY an Android phone

You do **not** need a computer. You can deploy straight from your Android phone
using the **GitHub website** + the **Cloudflare Pages dashboard**, both in your
mobile browser (Chrome). Cloudflare builds the project for you in the cloud, so
your phone never has to run `npm` or `wrangler`.

There are two easy phone-only methods. **Method A (GitHub + Cloudflare Pages)**
is the recommended one.

---

## ✅ Before you start
- A free **Cloudflare** account → https://dash.cloudflare.com/sign-up
- A free **GitHub** account → https://github.com/signup
- The project ZIP I gave you (`ngl-webapp-updated.zip`) saved to your phone.

---

## 🅰️ METHOD A — GitHub upload + Cloudflare Pages (recommended)

### Step 1 — Unzip the project on your phone
1. Open your **Files** app (or "My Files" on Samsung).
2. Find `ngl-webapp-updated.zip` in **Downloads**.
3. Tap it → **Extract / Unzip**. You now have a folder named `webapp`.

> Tip: If your Files app can't unzip, install **ZArchiver** (free, Play Store),
> open the zip with it, and tap **Extract Here**.

### Step 2 — Put the code on GitHub (from the phone browser)
1. In Chrome, go to **https://github.com** and log in.
2. Tap the **+** (top-right) → **New repository**.
3. Name it `ngl-webapp` → set it **Private** (recommended) → **Create repository**.
4. On the new repo page, tap **“uploading an existing file”** (a link in the
   “Quick setup” box). If you don't see it, open
   `https://github.com/YOUR-USERNAME/ngl-webapp/upload/main`.
5. Tap **choose your files** and select **all the files and folders _inside_ the
   `webapp` folder** (the `src` folder, `public` folder, `package.json`,
   `wrangler.jsonc`, `migrations`, etc.).
   - ⚠️ Upload the **contents** of `webapp`, not the `webapp` folder itself.
   - The GitHub mobile upload lets you pick multiple files; if it won't let you
     pick folders, use Method B below, or the **GitHub mobile app** which handles
     folders better.
6. Scroll down → tap **Commit changes**.

### Step 3 — Connect Cloudflare Pages to the repo
1. In Chrome, open **https://dash.cloudflare.com** and log in.
2. Left menu → **Workers & Pages** → tap **Create** → **Pages** tab →
   **Connect to Git**.
3. Tap **Connect GitHub**, authorize Cloudflare, and pick your `ngl-webapp` repo.
4. On the **Set up builds and deployments** screen enter exactly:
   - **Project name:** `ngl-webapp` (this becomes your URL: `ngl-webapp.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Tap **Save and Deploy**. Cloudflare will install and build in the cloud
   (~1–2 minutes). When it says **Success**, your site is live at
   `https://ngl-webapp.pages.dev` 🎉

### Step 4 — Create the database (D1) — required for login/messages
The app stores accounts & messages in **Cloudflare D1**. Set it up from the phone:

1. Cloudflare dash → **Storage & Databases** → **D1 SQL Database** → **Create**.
   - Name it exactly **`ngl-webapp-production`** → **Create**.
2. Open the new database → **Console** tab. Paste the contents of the file
   `migrations/0001_initial_schema.sql` (open it from your unzipped folder with a
   text app, copy all) → tap **Execute**. This creates the tables.
3. (Optional, to create the admin login) In the same **Console**, paste the
   contents of `seed.sql` → **Execute**. Default admin is
   **username `admin` / password `admin123`** — change it later.

### Step 5 — Bind the database to your Pages project
1. Cloudflare dash → **Workers & Pages** → open **ngl-webapp**.
2. **Settings** → **Bindings** (or **Functions → D1 database bindings**) →
   **Add binding**:
   - **Variable name:** `DB`  ← must be exactly `DB`
   - **D1 database:** choose `ngl-webapp-production`
   - Save.
3. Go to **Deployments** → tap the **⋯** on the latest deploy → **Retry deployment**
   (so the new binding takes effect).

### Step 6 — Done — open your site
- Visit **https://ngl-webapp.pages.dev** on your phone.
- Sign up, copy your link `ngl-webapp.pages.dev/yourname`, and test sending a
  message (it will ask for the camera for human verification).

> 🔁 **To update later:** just upload the changed files to GitHub again
> (Step 2). Cloudflare auto-rebuilds and redeploys every time you commit.

---

## 🅱️ METHOD B — No GitHub, upload the built folder directly (Direct Upload)
Cloudflare Pages “Direct Upload” needs the **already-built `dist` folder**.
Phones can't run the build, so use this only if the ZIP I gave you **already
contains a `dist` folder** (it does — I built it for you):

1. Unzip the project (Method A, Step 1).
2. Inside, **zip only the `dist` folder’s _contents_** using ZArchiver
   (open `dist` → select all → **Compress** → make `dist.zip`).
3. Cloudflare dash → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets** (Direct Upload).
4. Project name: `ngl-webapp` → **Create project**.
5. Upload your `dist.zip` (or the files) → **Deploy site**.
6. Then do **Method A, Steps 4–6** to add and bind the D1 database (same as above).

> Note: With Direct Upload you must re-upload a freshly built `dist` every time you
> change the code, which a phone can't build — so **Method A is better long-term.**

---

## 🔧 Troubleshooting (phone)
- **Site loads but login/send fails** → the D1 binding is missing or the tables
  weren't created. Re-check **Step 4 & 5**, then **Retry deployment**.
- **Build failed on Cloudflare** → make sure Build command is `npm run build`
  and Output directory is `dist`, framework preset **None**.
- **Camera won't open on the send page** → the browser needs camera permission
  and the site must be **https** (Cloudflare Pages is https by default). Allow the
  camera when prompted.
- **Uploading folders to GitHub is hard on mobile** → install the **GitHub app**
  from the Play Store, or use **Method B** direct upload.

## 🔐 After it works
- Log in as `admin` / `admin123`, then change the admin password (or delete the
  admin row and re-seed with your own hash).
- Make your GitHub repo **Private** so your code/data stays yours.
