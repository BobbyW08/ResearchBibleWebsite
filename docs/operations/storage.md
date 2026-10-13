# Storage

## Current state

**No cloud storage is configured.** Payload writes uploaded media to `public/media/` on the local filesystem.

On Vercel, the filesystem is **ephemeral**: anything written at runtime is lost on the next deploy. Media uploaded through `/admin` will disappear after the next Vercel deploy.

## Impact at launch

Not a problem at launch because all images used on the site (hero photos, credential photo, pain point icons) are committed to the repo under `public/`. They are deployed with the build and are durable.

Bobby must not upload media through `/admin` until cloud storage is configured.

## Fix (before uploading media through admin)

Choose one storage provider and add the Payload adapter:

| Option | Package | Requires |
|---|---|---|
| Vercel Blob | `@payloadcms/storage-vercel-blob` | Vercel Blob store (provision in Vercel dashboard) |
| AWS S3 | `@payloadcms/storage-s3` | S3 bucket + IAM credentials |
| Cloudflare R2 | `@payloadcms/storage-s3` (S3-compatible) | R2 bucket + API token |

**BLOCKED-ON-BOBBY:** Choose a provider, provision the bucket/store, add the adapter to `payload.config.ts`, and set the required env vars. This is not needed for the public launch.

## Start Here Row 2 photos

The three panel images in the Start Here section (`components/marketing/start-here.tsx`, `ROW_TWO_PANELS`) are currently Unsplash stock photo URLs. These are real URLs committed to the repo -- they work but are placeholder content.

**BLOCKED-ON-BOBBY:** Swap `ROW_TWO_PANELS` URL constants when real photos are available. Real photos should be committed to `public/` (not uploaded through `/admin`) until cloud storage is configured.
