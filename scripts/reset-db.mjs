/**
 * Reset the local demonstration database.
 *
 * Usage: npm run db:reset
 *
 * Deletes the SQLite file (and its WAL/SHM companions) plus locally stored
 * uploads. The database is recreated and seeded the next time the app starts.
 */
import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve(process.cwd(), process.env.DATA_DIR || "data");
const dbFiles = ["is-this-art.db", "is-this-art.db-wal", "is-this-art.db-shm"];

let removed = 0;
for (const file of dbFiles) {
  const target = path.join(dataDir, file);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { force: true });
    removed += 1;
  }
}

const uploads = path.join(dataDir, "uploads");
if (fs.existsSync(uploads)) {
  fs.rmSync(uploads, { recursive: true, force: true });
}

fs.mkdirSync(path.join(dataDir, "uploads"), { recursive: true });

console.log(
  removed > 0
    ? `Reset complete. Removed ${removed} database file(s) from ${dataDir}.`
    : `No database found in ${dataDir}. A fresh one will be created on next start.`,
);
