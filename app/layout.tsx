import type { Metadata } from 'next';
import { ImageLightbox } from './components/image-lightbox';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taebin Yoo',
  description: 'Taebin Yoo · Live sound engineering, spatial audio research, and music technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}<ImageLightbox /></body>
    </html>
  );
}
