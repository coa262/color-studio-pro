import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Color Studio Pro - Professional Color Picker & Palette Generator',
  description: 'Professional color picker and palette generator. Convert between HEX, RGB, HSL, HSV, CMYK formats. Generate inspiring color palettes for your design projects.',
  keywords: 'color picker, color converter, color palette, HEX, RGB, HSL, HSV, CMYK, design tools, color schemes',
  authors: [{ name: 'Color Studio Pro' }],
  viewport: 'width=device-width, initial-scale=1',
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
