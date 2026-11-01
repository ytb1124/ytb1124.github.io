'use client';

import { useEffect, type RefObject } from 'react';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function useOpeningScroll(
  openingRef: RefObject<HTMLDivElement | null>,
  heroRef: RefObject<HTMLElement | null>,
  textRef: RefObject<HTMLHeadingElement | null>,
) {
  useEffect(() => {
    const opening = openingRef.current;
    const hero = heroRef.current;
    const text = textRef.current;
    if (!opening || !hero || !text) return;

    const words = Array.from(text.querySelectorAll<HTMLElement>('.home-reveal-word'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | null = null;
    let nearby = true;
    let disposed = false;

    const update = () => {
      frame = null;
      if (disposed) return;
      if (motion.matches) {
        opening.removeAttribute('data-scroll-ready');
        opening.style.setProperty('--hero-fade', '0');
        return;
      }

      // Read geometry together before writing any styles.
      const viewport = window.innerHeight;
      const heroBounds = hero.getBoundingClientRect();
      const textBounds = text.getBoundingClientRect();
      const heroFade = clamp((viewport * 0.85 - heroBounds.bottom) / (viewport * 0.65));
      const progress = clamp((viewport * 0.82 - textBounds.top) / Math.max(1, textBounds.height + viewport * 0.37));

      opening.style.setProperty('--hero-fade', heroFade.toFixed(4));
      words.forEach((word, index) => {
        const start = (index / Math.max(1, words.length - 1)) * 0.82;
        word.style.setProperty('--word-reveal', clamp((progress - start) / 0.18).toFixed(4));
      });
      opening.setAttribute('data-scroll-ready', '');
    };

    const schedule = () => {
      if (!disposed && frame === null) frame = window.requestAnimationFrame(update);
    };
    const onScroll = () => { if (nearby) schedule(); };
    const visibility = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      // Update on exit too, so a fast jump leaves the correct final state.
      schedule();
    }, { rootMargin: '160px 0px' });
    visibility.observe(opening);

    const resize = new ResizeObserver(schedule);
    resize.observe(hero);
    resize.observe(text);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    motion.addEventListener('change', schedule);
    document.fonts.ready.then(schedule);
    update();

    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      motion.removeEventListener('change', schedule);
      opening.removeAttribute('data-scroll-ready');
      opening.style.removeProperty('--hero-fade');
      words.forEach(word => word.style.removeProperty('--word-reveal'));
    };
  }, [openingRef, heroRef, textRef]);
}
