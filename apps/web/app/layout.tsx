import type { Metadata } from 'next';
import { Fraunces, Space_Grotesk } from 'next/font/google';
import Link from 'next/link';

import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
});

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'BuildrLab Community SaaS',
  description: 'A community-built SaaS starter kit for production-ready teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-brand-700/20 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold text-brand-900">
                BuildrLab SaaS
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-brand-900">
                <Link href="/docs" className="hover:text-brand-700">
                  Docs
                </Link>
                <Link href="/app" className="rounded-full border border-brand-700/30 px-4 py-2 hover:bg-brand-100">
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-brand-700/20 bg-white/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-brand-900/70">
                Built by the BuildrLab community. MIT licensed.
              </p>
              <img
                src="/assets/powered-by-buildrlab.svg"
                alt="Powered by BuildrLab"
                className="h-10 w-auto"
              />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
