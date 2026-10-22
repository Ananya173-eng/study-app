import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Study Hub | Next-Gen Academic Intelligence',
  description: 'Discover powerful AI assistants tailored for student success—from deep essay synthesis and active recall planning to fast code execution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
