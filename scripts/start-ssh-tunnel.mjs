/**
 * Fallback tunnel using free localhost.run SSH.
 *
 * No account, domain, credit card or extra binary is needed — Windows 10/11
 * already ships with OpenSSH. However, the free tier is aggressively
 * bandwidth-throttled, so prefer `npm run tunnel` (Cloudflare) when possible.
 *
 * Usage:
 *   1. npm run build
 *   2. npm start                 # serves http://localhost:3000
 *   3. npm run tunnel:ssh        # in a second terminal
 */

import { spawn } from 'node:child_process';

const PORT = process.env.PORT || '3000';
const TARGET = process.env.TUNNEL_TARGET || `http://localhost:${PORT}`;
const parsed = new URL(TARGET);
const REMOTE_PORT = process.env.TUNNEL_REMOTE_PORT || '80';
const HOST = process.env.TUNNEL_HOST || 'nokey@localhost.run';
const knownHosts = process.platform === 'win32' ? 'NUL' : '/dev/null';

const args = [
  '-T',
  '-o',
  'StrictHostKeyChecking=no',
  '-o',
  `UserKnownHostsFile=${knownHosts}`,
  '-o',
  'ServerAliveInterval=60',
  '-R',
  `${REMOTE_PORT}:${parsed.hostname}:${parsed.port || '80'}`,
  HOST,
];

process.stdout.write(`Starting SSH tunnel to ${TARGET}\n`);

const child = spawn('ssh', args, {
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});

let announced = false;
let buffer = '';
const urlPattern = /https:\/\/[a-z0-9-]+\.(?:app\.lhr\.life|lhr\.life|localhost\.run)/gi;

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

child.on('error', (error) => {
  console.error(`\nFailed to start ssh: ${error.message}`);
  console.error('Install OpenSSH (Windows 10/11: Settings → Apps → Optional features) or check your PATH.');
  process.exitCode = 1;
});

const shutdown = () => child.kill('SIGTERM');
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

child.on('exit', (code) => {
  process.exitCode = code ?? 0;
});
