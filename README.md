# Soheil Portfolio

## Local development

1. Copy `.dev.vars.example` to `.dev.vars` and set a private `ADMIN_PASSWORD` and a random `SESSION_SECRET` (at least 32 characters). Do not commit `.dev.vars`.
2. Apply the local D1 migration with `npm run db:migrate:local`.
3. Run `npm run dev`. Vite serves the site at `http://localhost:3000` and proxies `/api` to the local Worker.
4. Open `/admin` and import `site-content-export.json` to initialize an empty D1 database. The site does not seed content automatically.

## Cloudflare deployment

The Worker serves the built Vite assets and the `/api` endpoints. D1 is already configured in `wrangler.jsonc`.

1. Set the production secrets without putting them in source control:

   ```powershell
   npx wrangler secret put ADMIN_PASSWORD
   npx wrangler secret put SESSION_SECRET
   ```

   Use a unique admin password and a random session secret of at least 32 characters.
2. Apply the schema to the configured D1 database:

   ```powershell
   npm run db:migrate:remote
   ```
3. Build and deploy:

   ```powershell
   npm run build
   npm run deploy
   ```
4. Configure `soheil-ja.ir` as a custom domain for this Worker in Cloudflare. The public site uses `/fa` and `/en`; the admin panel is at `/admin`.
5. Open `/admin`, upload `site-content-export.json`, and save it to initialize site content in D1.

The Worker serves public content only from the `site_content` record in D1; an empty database is not populated from bundled defaults. Content updates are saved to this record.

Project and certificate images are static assets, not R2 uploads. Run `npm run dev`, open the local admin panel, and choose a JPG, PNG, or WebP image. The browser converts it to WebP (up to 2560 pixels on the longest side, targeting 1.5 MB), then the local Vite server saves it under `public/images/portfolio/`. Build and deploy the new asset:

```powershell
npm run build
npm run deploy
```

In the production admin panel, set the image URL to `/images/portfolio/<filename>.webp` and save it to D1. Commit the generated file if you want to keep it in the repository. New image files require a new deployment; no R2 account or identity verification is needed.
