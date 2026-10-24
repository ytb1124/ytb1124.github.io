'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type LightboxImage = { src: string; alt: string; locale: 'en' | 'ko' };

export function ImageLightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDialogElement | null>(null);

  const close = () => {
    setImage(null);
    requestAnimationFrame(() => lastFocused.current?.focus());
  };

  useEffect(() => {
    const openImage = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      const element = target.closest('img');
      if (!(element instanceof HTMLImageElement)) return false;
      if (!element.closest('main') || element.closest('a[href], summary') || element.closest('.admin-shell') || element.closest('[data-no-lightbox]') || element.closest('.image-lightbox')) return false;
      lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const locale = element.closest('[lang]')?.getAttribute('lang') === 'ko' ? 'ko' : 'en';
      setImage({ src: element.currentSrc || element.src, alt: element.alt || (locale === 'ko' ? '확대 사진' : 'Enlarged photograph'), locale });
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
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
    closeButton.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [image]);

  if (!image) return null;

  const closeLabel = image.locale === 'ko' ? '확대 사진 닫기' : 'Close enlarged image';
  return <dialog ref={dialog} className="image-lightbox" aria-label={image.alt} onCancel={close}>
    <button className="image-lightbox-backdrop" type="button" tabIndex={-1} aria-label={closeLabel} onClick={close} />
    <button ref={closeButton} className="image-lightbox-close" type="button" aria-label={closeLabel} onClick={close}>×</button>
    <Image src={image.src} alt={image.alt} width={1800} height={1200} unoptimized />
  </dialog>;
}
