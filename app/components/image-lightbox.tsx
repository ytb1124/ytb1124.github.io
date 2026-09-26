'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type LightboxImage = { src: string; alt: string };

export function ImageLightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    setImage(null);
    requestAnimationFrame(() => lastFocused.current?.focus());
  };

  useEffect(() => {
    const openImage = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      const element = target.closest('img');
      if (!(element instanceof HTMLImageElement)) return false;
      if (!element.closest('main') || element.closest('.admin-shell') || element.closest('[data-no-lightbox]') || element.closest('.image-lightbox')) return false;
      lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setImage({ src: element.currentSrc || element.src, alt: element.alt || 'Enlarged photograph' });
      return true;
    };

    const onClick = (event: MouseEvent) => {
      if (openImage(event.target)) event.preventDefault();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && image) close();
      if (event.key === 'Enter' && openImage(event.target)) event.preventDefault();
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [image]);

  useEffect(() => {
    if (!image) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [image]);

  if (!image) return null;

  return <dialog open className="image-lightbox" aria-label={image.alt} onCancel={close}>
    <button className="image-lightbox-backdrop" type="button" aria-label="Close enlarged image" onClick={close} />
    <button ref={closeButton} className="image-lightbox-close" type="button" aria-label="Close enlarged image" onClick={close}>×</button>
    <Image src={image.src} alt={image.alt} width={1800} height={1200} unoptimized />
  </dialog>;
}
