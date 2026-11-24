import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { randomUUID } from 'node:crypto';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-static-image-upload',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use('/api/uploads', (request, response, next) => {
            if (request.method !== 'POST') {
              next();
              return;
            }

            const remoteAddress = request.socket.remoteAddress;
            if (
              remoteAddress !== '127.0.0.1' &&
              remoteAddress !== '::1' &&
              !remoteAddress?.endsWith('::ffff:127.0.0.1')
            ) {
              response.writeHead(403, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({ error: 'Local image upload only.' }));
              return;
            }

            const origin = request.headers.origin;
            if (origin) {
              try {
                if (new URL(origin).host !== request.headers.host) {
                  response.writeHead(403, { 'Content-Type': 'application/json' });
                  response.end(JSON.stringify({ error: 'Cross-origin upload rejected.' }));
                  return;
                }
              } catch {
                response.writeHead(403, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'Invalid upload origin.' }));
                return;
              }
            }

            if (
              request.headers['content-type']?.split(';')[0].trim().toLowerCase() !==
              'image/webp'
            ) {
              response.writeHead(415, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({ error: 'Only WebP images can be uploaded.' }));
              return;
            }

            const maxBytes = 8 * 1024 * 1024;
            const declaredLength = Number(request.headers['content-length'] || 0);
            if (declaredLength > maxBytes) {
              response.writeHead(413, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({ error: 'WebP image exceeds the 8 MB limit.' }));
              return;
            }

            const chunks: Buffer[] = [];
            let totalBytes = 0;
            let tooLarge = false;
            request.on('data', (chunk: Buffer | string) => {
              const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
              totalBytes += buffer.byteLength;
              if (totalBytes > maxBytes) {
                tooLarge = true;
                chunks.length = 0;
                return;
              }
              if (!tooLarge) chunks.push(buffer);
            });
            request.on('error', (error: Error) => next(error));
            request.on('end', () => {
              if (tooLarge) {
                response.writeHead(413, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'WebP image exceeds the 8 MB limit.' }));
                return;
              }

              const bytes = Buffer.concat(chunks);
              if (
                bytes.byteLength < 12 ||
                bytes.toString('ascii', 0, 4) !== 'RIFF' ||
                bytes.toString('ascii', 8, 12) !== 'WEBP'
              ) {
                response.writeHead(415, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'The uploaded file is not a valid WebP image.' }));
                return;
              }

              try {
                const id = randomUUID();
                const uploadDirectory = path.resolve(
                  __dirname,
                  'public',
                  'images',
                  'portfolio',
                );
                fs.mkdirSync(uploadDirectory, { recursive: true });
                fs.writeFileSync(path.join(uploadDirectory, `${id}.webp`), bytes, {
                  flag: 'wx',
                });
                response.writeHead(201, { 'Content-Type': 'application/json' });
                response.end(
                  JSON.stringify({
                    uploaded: true,
                    url: `/images/portfolio/${id}.webp`,
                  }),
                );
              } catch (error) {
                console.error('Could not write local portfolio image:', error);
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'Could not save image to public folder.' }));
              }
            });
          });
        },
      } satisfies Plugin,
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8787',
          changeOrigin: false,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
