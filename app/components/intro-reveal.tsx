import type { Ref } from 'react';

export type RevealSegment = {
  text: string;
  accent?: boolean;
};

export function IntroReveal({ lines, ref }: { lines: RevealSegment[][]; ref: Ref<HTMLHeadingElement> }) {
  return (
    <h2 className="home-reveal-text" id="home-intro-title" ref={ref}>
      <span className="sr-only">{lines.map(line => line.map(segment => segment.text).join('')).join(' ')}</span>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span className="home-reveal-line" key={lineIndex}>
            {line.flatMap((segment, segmentIndex) => segment.text.split(/(\s+)/).filter(Boolean).map((token, tokenIndex) => (
              /^\s+$/.test(token)
                ? token
                : <span className={`home-reveal-word${segment.accent ? ' is-accent' : ''}`} key={`${segmentIndex}-${tokenIndex}`}>{token}</span>
            )))}
          </span>
        ))}
      </span>
    </h2>
  );
}
