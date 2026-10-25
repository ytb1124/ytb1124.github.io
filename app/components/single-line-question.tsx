'use client';

import { useLayoutEffect, useRef } from 'react';

export function SingleLineQuestion({ children }: { children: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const paragraph = paragraphRef.current;
    const text = textRef.current;
    if (!paragraph || !text) return;
    let active = true;
    let frame = 0;
    let previousWidth = -1;

    const fit = () => {
      if (!active || !paragraph.clientWidth) return;
      const maximum = parseFloat(getComputedStyle(paragraph).getPropertyValue('--question-font-max')) || 17;
      paragraph.style.fontSize = `${maximum}px`;
      const naturalWidth = text.getBoundingClientRect().width;
      const ratio = naturalWidth ? Math.min(1, (paragraph.clientWidth - 1) / naturalWidth) : 1;
      paragraph.style.fontSize = `${maximum * ratio}px`;
    };

    const observer = new ResizeObserver(() => {
      if (paragraph.clientWidth === previousWidth) return;
      previousWidth = paragraph.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    });
    observer.observe(paragraph);
    fit();
    document.fonts.ready.then(fit);
    document.fonts.addEventListener('loadingdone', fit);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', fit);
    };
  }, [children]);

  return <p className="single-line-question" ref={paragraphRef}><span ref={textRef}>{children}</span></p>;
}
