import type { Metadata } from 'next';
import { ImageLightbox } from './components/image-lightbox';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taebin Yoo',
  description: 'Researcher in Live Performance Technology | Immersive & Spatial Audio',
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
