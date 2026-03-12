import "./globals.css";
import { ReactNode } from "react";
import { ensureDataDirs } from "@/lib/data-dir";

export default function RootLayout({ children }: { children: ReactNode }) {
  ensureDataDirs();

  return (
    <html lang="zh-Hant">
      <body>
        <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
