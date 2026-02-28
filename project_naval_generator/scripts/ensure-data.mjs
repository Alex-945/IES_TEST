import { mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
["data", "data/db", "data/exports", "data/uploads", "data/logs"].forEach((rel) => {
  mkdirSync(join(root, rel), { recursive: true });
});
