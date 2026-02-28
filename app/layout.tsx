import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">Novel Workbench</h1>
          <nav className="flex gap-3 text-sm">
            <Link href="/projects">Projects</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
