# Backups and Restore

## What needs backing up

| Data | Location | Backup mechanism |
|---|---|---|
| Database (all app data) | Neon Postgres | Neon continuous backup + point-in-time restore (PITR) |
| CMS content (deep dives, pain points, etc.) | Payload collections in `payload_cms` schema | Covered by Neon backup |
| Uploaded media | Payload `media` collection metadata in Neon; files on the local filesystem (`media/` at the project root) | Not durable on Vercel. See Media note below |
| Source code | GitHub `BobbyW08/ResearchBibleWebsite` | Git history; Vercel deployment archive |
| Environment variables | Vercel project settings | Bobby's password manager / secure note |

### Media note

Payload stores media file metadata in the database. The actual files are written to `media/` at the project root (Payload's default upload directory). On Vercel, the filesystem is ephemeral - files written at runtime are lost on the next deploy. **BLOCKED-ON-BOBBY:** If Bobby uploads images through `/admin`, those files need to be moved to a persistent store (e.g. Vercel Blob, Cloudinary, or S3) before production use. Until then, only images committed to the repo and deployed with the build are durable.

---

## Neon Backup (Database)

Neon provides automatic continuous backup on all plans. Point-in-time restore is available in the Neon console.

### Restore procedure

1. Sign in at `console.neon.tech`.
2. Select the project used by this app.
3. Go to **Branches** → select the production branch → **Restore**.
4. Choose a restore point (timestamp or named restore point).
5. Neon restores to a new branch. Verify data looks correct.
6. To cut over: update `DATABASE_URI` in Vercel to point at the restored branch's connection string, then redeploy.

### Manual export (ad-hoc)

To take a manual snapshot before a risky migration:

```bash
pg_dump "$DATABASE_URI" --schema=payload_cms --schema=public -Fc -f backup_$(date +%Y%m%d).dump
```

Store the dump file outside the repo (e.g. Bobby's local machine or a private S3 bucket).

---

## Vercel Deployment Archive

Every production deploy is retained in Vercel's deployment history. To roll back:

1. Go to the Vercel dashboard → **Deployments**.
2. Find the last known-good deploy.
3. Click the three-dot menu → **Promote to Production**.

This redeploys the old build without touching the database.

---

## Environment Variable Recovery

If env vars are lost from Vercel:

1. Refer to Bobby's secure note / password manager for the values.
2. Go to Vercel → **Project Settings** → **Environment Variables**.
3. Re-enter each value from the matrix in `docs/operations/environments.md`.

---

## Restore Test (run quarterly or after major schema changes)

Goal: confirm that a restore actually produces a working app.

1. **Create a Neon restore branch** from a 24-hour-old restore point.
2. **Spin up a local or preview deploy** pointing at the restore branch (`DATABASE_URI` → restore branch connection string).
3. **Smoke test** (same steps as `docs/operations/environments.md` post-deploy checklist).
4. Confirm that:
   - Payload admin loads and shows expected collections.
   - At least one deep dive and one pain point render correctly.
   - The restore branch is deleted after the test (to avoid Neon branch proliferation).

**Last restore test:** Not yet run. BLOCKED-ON-BOBBY: schedule first test after launch.
