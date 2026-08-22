# Kumaran M — Freelance Portfolio

A React + Vite portfolio built around a "technical blueprint" design language —
grid paper, schematic diagrams, and drafting-plate cards — matched to a
full-stack / AI-systems / DevOps profile.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

## Editing content

Everything you'd want to change — name, bio, projects, skills, experience,
links — lives in **one file**: `src/data/portfolioData.js`. You don't need to
touch any component to update copy, add a project, or change contact details.

To add a 4th project, copy an existing object in the `projects` array and
fill in the fields (`code` should follow the `DWG-0X` pattern to stay
consistent with the drafting theme).

## Deploying (free options)

**Vercel (recommended)**
1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Framework preset: Vite. Click Deploy. Done — you'll get a live URL to put
   on Upwork/Fiverr/Freelancer profiles.

**Netlify**
1. Push to GitHub.
2. netlify.com → Add new site → Import from Git.
3. Build command: `npm run build`, publish directory: `dist`.

**GitHub Pages**
1. `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "vite build && gh-pages -d dist"`
3. Set `base: '/your-repo-name/'` in `vite.config.js`.
4. `npm run deploy`

## Before you publish — a checklist for winning more bids

- [ ] Swap placeholder-free content for real links: make sure the RAG demo
      and CV-Genix repo are live and reachable (dead links hurt trust more
      than no link at all).
- [ ] Add 2–3 line client testimonials once you have them — real quotes,
      even short ones, do more for credibility than any design choice.
- [ ] Keep the "Available for freelance" status in `portfolioData.js`
      accurate — update it when you're booked.
- [ ] Pin a custom domain (e.g. `kumaranm.dev`) once deployed — it reads as
      more established than a `.vercel.app` URL on bid platforms.
- [ ] Link this portfolio URL directly in your Upwork/Fiverr bio and in every
      proposal you send.
