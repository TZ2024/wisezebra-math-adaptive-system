import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WiseZebra Math Adaptive Assessment and Practice System',
  description: 'Adaptive diagnostic and practice system for Grades 1 to 6 plus prealgebra bridge.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
