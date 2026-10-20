# ZEO Weekly Log

A weekly workout tracker you host yourself: per-day logging (weight × reps × sets), weekly maxes with estimated 1RM, progress charts, CSV/JSON export, and sync between your phone and laptop. It's a plain static site — no build step — and installs to your phone's home screen.

```
index.html             page markup
styles.css             look and feel (light + dark)
app.js                 the tracker, plus sync and sign-in
config.js              your Supabase URL + key (the only file you edit)
sw.js                  offline support; bump VERSION after each deploy
manifest.webmanifest   home-screen install
supabase/schema.sql    database table + privacy rules (run once)
netlify.toml           Netlify settings
vercel.json            Vercel settings
```

How data flows: every change saves to the browser immediately, then pushes to your Supabase database a moment later. When you open the app on another device (or bring it back to the foreground), it pulls the latest; for each week the most recently edited copy wins. With no signal, edits queue up and sync when you're back online.

---

## 1. Set up the database (Supabase, free tier) — ~5 min

1. Create an account at **supabase.com** → **New project**. Any name and region (US East is closest to you); save the database password somewhere, though you won't need it here.
2. In the project, open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**. You should see "Success. No rows returned."
3. Open **Project Settings → API** (sometimes shown as **Data API** / **API Keys**) and copy:
   - **Project URL** — like `https://abcdxyz.supabase.co`
   - **anon public** key — the long string starting `eyJ…` (or a `sb_publishable_…` key on newer projects)
4. Paste both into `config.js`:
   ```js
   window.ZEO_CONFIG = {
     supabaseUrl: "https://abcdxyz.supabase.co",
     supabaseAnonKey: "eyJhbGciOi..."
   };
   ```
   The anon/publishable key is designed to be public. The row-level-security rules from `schema.sql` are what keep your rows readable only by you. Never put the **service_role** / secret key in this file.

## 2. Deploy

**Netlify (simplest):** log in at app.netlify.com → **Add new site → Deploy manually** → drag the whole `zeo-tracker` folder onto the drop zone. You'll get a URL like `https://zeo-log-123.netlify.app` (rename it under Site configuration → Change site name).

**Netlify from GitHub:** push this folder to a repo → **Add new site → Import an existing project** → pick the repo. Leave the build command empty; publish directory is `.` (already set in `netlify.toml`). Every push redeploys.

**Vercel:** push the folder to a GitHub repo → vercel.com → **Add New → Project** → import the repo → Framework preset **Other**, no build command, output directory `.` → Deploy. Or from a terminal in this folder: `npx vercel --prod`.

## 3. Point Supabase at your site

In Supabase: **Authentication → URL Configuration** → set **Site URL** to your deployed address (e.g. `https://zeo-log-123.netlify.app`) and add the same under **Redirect URLs**. This makes the account-confirmation email link back to your tracker.

## 4. Create your account, then lock the door

1. Open your site → scroll to **Sync** → enter email + password → **Create account**. Click the confirmation link in the email, then **Sign in**.
2. Back in Supabase: **Authentication → Sign In / Providers** (or **Settings**) → turn off **Allow new users to sign up**. Your account keeps working; nobody else can create one on your database.

Sign in with the same email and password on each device.

## 5. Bring over your existing log

Your current entries live in the Claude version of the tracker. Open it there → **Export backup** → on the new site, sign in → **Import backup** → pick that `.json` file. Imported weeks sync up right away.

## 6. Put it on your phone

- **iPhone:** open the site in Safari → Share → **Add to Home Screen**.
- **Android:** open in Chrome → ⋮ menu → **Install app** / **Add to Home screen**.

It opens full-screen and works without signal at the gym.

---

## Updating the app

Edit files, bump `VERSION` in `sw.js` (e.g. `zeo-v2`), redeploy. Phones pick up the new version the next time they open the app online.

Workouts live in `WORKOUTS` near the top of `app.js`; `SCHED` sets the default one or two workouts for each weekday (0 = Sunday, `[]` = rest). Each day's **Workouts** checkboxes let you pick up to two for that day (saved per day; **Back to schedule** restores the default). An exercise that's in both picked workouts shows once. Exercise dropdown choices live in `POOLS`, grouped by equipment (`bw` bodyweight, `mach` machine/cable, `free` free weight, `band` bands). Keep existing exercise names stable if you want old entries to stay attached to them — each row's saved data is keyed by its default name.

**Fasting:** the panel under the header runs a live timer. Tap **Start** to begin now, or set **Already started?** to a past time first. While a fast runs you can still correct its start time. **Fasting this week** near the bottom shows hours fasted per day for the week you're viewing (a fast crossing midnight is split between the days) and lists those fasts so you can delete any mistakes. Each fast is stored in the week it started (`fasts: [{s, e}]`, ms timestamps; `e` is missing while it runs), so it syncs and backs up with that week.

## Running without sync

Leave both values in `config.js` blank. Everything still works; data stays in that one browser, and Export/Import moves it between devices by hand.

## Troubleshooting

- **Badge says "Not synced"** — the Sync section shows the error. Usually the URL/key in `config.js` is wrong, or `schema.sql` wasn't run. Your entries are safe on the device either way.
- **"Email not confirmed"** — click the link in the Supabase email first (check spam), or disable *Confirm email* under Authentication → Sign In / Providers → Email.
- **Old version still showing after a deploy** — bump `VERSION` in `sw.js`, redeploy, and reopen the app twice.
- **Free-tier pause** — Supabase pauses free projects after about a week of no activity. Logging workouts weekly keeps it awake; if it does pause, click **Restore** in the dashboard. Nothing is lost.
