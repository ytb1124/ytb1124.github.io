import type { Metadata } from 'next';
import { ImageLightbox } from './components/image-lightbox';
import './globals.css';
import './reading.css';
import './finish.css';

export const metadata: Metadata = {
  title: 'Taebin Yoo',
  description: 'Taebin Yoo · Music Technology & Sound Engineer · Spatial audio research',
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
