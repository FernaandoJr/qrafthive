import { Navbar } from '@/components/blocks/navbar';
import Providers from '@/layout/providers';
import type { Metadata } from 'next';
import { Merriweather, Outfit } from 'next/font/google';
import './globals.css';

const outfitSans = Outfit({
  variable: '--font-outfit-sans',
  subsets: ['latin'],
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'QRaftHive',
  description: 'QRaftHive',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${outfitSans.variable} ${merriweather.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
