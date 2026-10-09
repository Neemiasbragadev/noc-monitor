import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOC Monitor",
  description: "Painel de monitoramento de servidores em Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-strong focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <header className="border-b border-border bg-surface">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="size-2.5 rounded-full bg-ok" aria-hidden />
                NOC Monitor
              </Link>
              <nav aria-label="Principal" className="flex gap-1 text-sm">
                <Link href="/" className="rounded-md px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-text">
                  Painel
                </Link>
                <Link href="/servidores/novo" className="rounded-md px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-text">
                  Novo servidor
                </Link>
              </nav>
            </div>
          </header>
          <main id="conteudo" className="mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
