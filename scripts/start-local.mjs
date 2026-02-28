import { spawn } from "node:child_process";

const url = "http://localhost:3000/projects";
const openCmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";

const dev = spawn("npx", ["next", "dev"], { stdio: "inherit", shell: true });

setTimeout(() => {
  spawn(openCmd, [url], { stdio: "ignore", shell: true });
}, 2500);

dev.on("exit", (code) => process.exit(code ?? 0));
