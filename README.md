# bobby-washburn.com

Parenting education and peer-support site for Bobby Washburn's practice. Next.js 16 (App Router) with Payload CMS 3 on Neon Postgres, hosted on Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values; point DATABASE_URI at the preview Neon branch
npm run dev                  # http://localhost:3000, Payload admin at /admin
```

Before committing, all three must exit 0:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

## Where to look

- `CLAUDE.md` is the source of truth for what the site is, what is live, the stack, and the file map.
- `docs/operations/` covers deployment, environments, database, migrations, auth, backups, storage, email, moderation and the launch review.
