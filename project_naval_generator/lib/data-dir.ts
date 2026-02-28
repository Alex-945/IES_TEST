import { mkdirSync } from "node:fs";
import { join } from "node:path";

const dirs = ["data", "data/db", "data/exports", "data/uploads", "data/logs"];

export function ensureDataDirs() {
  const root = process.cwd();
  for (const rel of dirs) {
    mkdirSync(join(root, rel), { recursive: true });
  }
}
