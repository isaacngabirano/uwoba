import type { Metadata } from 'next';
import { Cormorant_Garamond, Space_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'UWOBA',
  description: 'UGANDA WOMENS BASKETRY ASSOCIATION',
  keywords: 'Baskets, Art and Crafts, Uganda',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
