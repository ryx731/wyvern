import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('./dist/', import.meta.url)));
const requestedPort = Number(process.env.PORT || 4173);
if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  throw new Error('PORT must be an integer from 1 to 65535.');
}
const contentTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8'
};
const insideRoot = target => target === root || target.startsWith(`${root}${path.sep}`);

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }
  try {
    const url = new URL(request.url, 'http://localhost');
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.includes('\0') || decoded.includes('\\')) throw new Error('Invalid path');
    let target = path.resolve(root, `.${decoded}`);
    if (!insideRoot(target)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    const resolved = await realpath(target);
    if (!insideRoot(resolved)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const file = await readFile(resolved);
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(resolved)] || 'application/octet-stream',
      'Content-Length': file.byteLength,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : file);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 400,
      { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page not found');
  }
});

server.listen(requestedPort, '127.0.0.1', () => {
  console.log(`Gesture Garden preview: http://127.0.0.1:${requestedPort}`);
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
