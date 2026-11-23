/**
 * Publish the local app through a free Cloudflare Quick Tunnel.
 *
 * No account, domain or credit card is needed. The URL changes every time the
 * tunnel restarts. For a stable domain, use a named Cloudflare Tunnel.
 *
 * If the printed URL does not open, your DNS provider is blocking
 * `trycloudflare.com`. Enable DNS-over-HTTPS in your browser:
 * Firefox → Settings → Network Settings → DNS over HTTPS → Cloudflare.
 *
 * Usage:
 *   1. npm run build
 *   2. npm start                 # serves http://localhost:3000
 *   3. npm run tunnel            # in a second terminal
 */

import { spawn } from 'node:child_process';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const TARGET =
  process.env.TUNNEL_TARGET || `http://localhost:${process.env.PORT || '3000'}`;
const BIN_DIR = path.join(os.tmpdir(), 'opencode', 'is-this-art-tunnel');
const BIN_PATH = path.join(BIN_DIR, 'cloudflared.exe');
const RELEASE_API =
  'https://api.github.com/repos/cloudflare/cloudflared/releases/latest';

async function ensureBinary() {
  try {
    const info = await stat(BIN_PATH);
    if (info.size > 1_000_000) return BIN_PATH;
  } catch {
    // Download below.
  }

  await mkdir(BIN_DIR, { recursive: true });
  const release = await fetch(RELEASE_API).then((response) => {
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return response.json();
  });
  const asset = release.assets?.find(
    (item) => item.name === 'cloudflared-windows-amd64.exe',
  );
  if (!asset) throw new Error('cloudflared Windows asset not found');

  process.stdout.write(`Downloading cloudflared ${release.tag_name}...\n`);
  const response = await fetch(asset.browser_download_url);
  if (!response.ok) throw new Error(`Download failed with ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1_000_000) throw new Error('Downloaded file is too small');
  await writeFile(BIN_PATH, bytes);
  return BIN_PATH;
}

async function main() {
  const binary = await ensureBinary();
  process.stdout.write(`Starting tunnel to ${TARGET}\n`);

  const child = spawn(binary, ['tunnel', '--no-autoupdate', '--url', TARGET], {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  let announced = false;
  let buffer = '';
  const urlPattern = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/gi;

  const consume = (chunk, stream) => {
    const text = chunk.toString();
    stream.write(text);
    buffer += text;
    if (buffer.length > 8000) buffer = buffer.slice(-4000);
    if (!announced) {
      const match = urlPattern.exec(buffer);
      if (match) {
        announced = true;
        process.stdout.write(`\nPUBLIC URL: ${match[0]}\n\n`);
      }
    }
  };

  child.stdout.on('data', (chunk) => consume(chunk, process.stdout));
  child.stderr.on('data', (chunk) => consume(chunk, process.stderr));

  const shutdown = () => child.kill('SIGTERM');
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  child.on('exit', (code) => {
    process.exitCode = code ?? 0;
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
