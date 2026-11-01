/**
 * Serves the static export in out/ the way GitHub Pages does (dir → index.html,
 * unknown paths → 404.html, optional BASE_PATH prefix). No dependencies.
 * Run: npm run preview   (after npm run build)
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const base = process.env.BASE_PATH ?? "";
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
};

if (!existsSync(root)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(1);
}

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  if (base && path.startsWith(base)) path = path.slice(base.length) || "/";
  let file = join(root, normalize(path));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  let status = 200;
  if (!file.startsWith(root) || !existsSync(file)) {
    file = join(root, "404.html");
    status = 404;
  }
  const type = types[extname(file)] ?? "application/octet-stream";
  // Compress text like GitHub Pages does, so local Lighthouse runs are representative.
  const gzip = /text|javascript|json|svg/.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(status, { "Content-Type": type, ...(gzip ? { "Content-Encoding": "gzip" } : {}) });
  (gzip ? createReadStream(file).pipe(createGzip()) : createReadStream(file)).pipe(res);
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}${base}/`));
