# Soheil Portfolio

## Local development

1. Copy `.dev.vars.example` to `.dev.vars` and set a private `ADMIN_PASSWORD` and a random `SESSION_SECRET` (at least 32 characters). Do not commit `.dev.vars`.
2. Apply the local D1 migration with `npm run db:migrate:local`.
3. Run `npm run dev`. Vite serves the site at `http://localhost:3000` and proxies `/api` to the local Worker.
4. Open `/admin` to manage the portfolio. The first content request initializes the D1 row from the checked-in portfolio defaults.

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

Content updates are saved to the single `site_content` record in D1. Images are managed by editing their public URL; file uploads require an R2 bucket and are not configured.
