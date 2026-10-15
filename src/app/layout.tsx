import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Study & Productivity Hub',
  description: 'Manage study notes, tasks, deadlines, and learning materials with modular AI assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#121214] text-gray-100 antialiased min-h-screen selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
