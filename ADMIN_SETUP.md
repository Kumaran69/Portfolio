# Admin & Backend Setup Guide

This portfolio now has three connected pieces:

1. **The site** (`/`) — reads live projects, experience, and profile blurb from a Google Sheet, falling back to the hardcoded data in `src/data/portfolioData.js` if the backend isn't reachable.
2. **The admin page** (`/admin`) — a password-gated page to add/edit/delete projects and experience, edit the hero summary/availability line, and view contact messages.
3. **The contact form** — submissions are saved as rows in your Google Sheet and the visitor gets an automatic professional thank-you email.

All three are powered by a single Google Apps Script Web App. Setup takes about 10 minutes.

---

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Rename it something like `Portfolio CMS`.
3. Copy the **Sheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_LONG_ID_HERE`**`/edit`

You don't need to create any tabs manually — the script creates `Projects`, `Experience`, `Profile`, and `Messages` tabs automatically the first time it runs.

## 2. Add the Apps Script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder `Code.gs` contents.
3. Paste in the entire contents of [`apps-script/Code.gs`](./apps-script/Code.gs) from this repo.
4. Click the **Save** icon (or `Ctrl+S`).

## 3. Set Script Properties

Still in the Apps Script editor:

1. Click the **⚙️ Project Settings** icon on the left.
2. Scroll to **Script Properties** → **Add script property**. Add these three:

| Property | Value |
|---|---|
| `SHEET_ID` | The Sheet ID you copied in step 1 |
| `ADMIN_KEY` | A long random password you invent — this is what unlocks `/admin`. Treat it like a password (e.g. generate one at [1password.com/password-generator](https://1password.com/password-generator/) or similar). |
| `OWNER_EMAIL` | *(optional)* Where you want new-inquiry notification emails sent. Defaults to your own Google account email if left blank. |

## 4. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" → choose **Web app**.
3. Settings:
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. The first time, Google will ask you to **authorize** the script (it needs permission to read/write the Sheet and send email). Click through the consent screen — you may see an "unverified app" warning since this is your own script; click **Advanced → Go to [project name] (unsafe)** to proceed. This is expected for scripts you write yourself.
6. Copy the **Web app URL** it gives you — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 5. Wire the URL into the site

Open `src/data/portfolioData.js` and replace the placeholder:

```js
export const scriptEndpoint = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

with the URL you copied. Commit and redeploy (push to your repo — Vercel will rebuild automatically).

## 6. First run / sanity check

Open your deployed URL in a browser with `?action=read` appended, e.g.:

```
https://script.google.com/macros/s/AKfycb.../exec?action=read
```

You should see JSON like `{"ok":true,"data":{"projects":[],"experience":[],"profile":{}}}`. This first request also auto-creates the sheet tabs — go check your spreadsheet, you should now see `Projects`, `Experience`, `Profile`, and `Messages` tabs.

## 7. Log into `/admin`

Go to `yoursite.com/admin` and enter the `ADMIN_KEY` you set in step 3. From there you can add your first projects and experience entries — they'll appear on the live site within a few seconds (the site refetches on load; hit refresh to see changes immediately after saving).

---

## How it stays in sync

- The **public site** calls `?action=read` (no auth) to load current data — this is what makes updates "live" without a redeploy.
- The **admin page** calls the same endpoint with `POST` + your `adminKey` for writes. The key is checked server-side in the script — never trust it client-side alone.
- If the script is unreachable (not deployed yet, wrong URL, or a network hiccup), the site silently falls back to the static seed data already in `portfolioData.js`, so the site never breaks — it just stops reflecting your latest admin edits until the connection is restored.

## Redeploying after editing Code.gs

If you change `apps-script/Code.gs` later, you must **re-deploy**: Deploy → Manage deployments → ✏️ Edit → change version to "New version" → Deploy. Simply saving the script does **not** update the live Web App.

## Security notes

- The `ADMIN_KEY` is a shared-secret password, not full user authentication — good enough for a single-owner personal site, but don't reuse a password you use elsewhere, and don't share the key.
- The key is stored in the browser's `sessionStorage` after login (cleared when the tab closes), not persisted long-term.
- Google's free tier for `MailApp` allows roughly 100 emails/day on a personal Gmail account, which is far more than a portfolio contact form needs.
