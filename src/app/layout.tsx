import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Raiken Corporation | Accounting, Conveyancing, Tax & IT Solutions Australia',
  description: 'National Australian advisory firm delivering specialized Accounting, Property Conveyancing, Taxation, Business Structuring, and IT Services across Adelaide, Brisbane, and Perth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
