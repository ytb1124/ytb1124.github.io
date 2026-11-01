'use client';

import { useRef } from 'react';
import { HeroShader } from './hero-shader';
import { IntroReveal, type RevealSegment } from './intro-reveal';
import { useOpeningScroll } from './use-opening-scroll';

type HomeOpeningProps = {
  locale: 'en' | 'ko';
  hero: string;
  name: string;
  role: string;
  cvHref: string;
  lines: RevealSegment[][];
  experience: string;
  aboutLabel: string;
  aboutHref: string;
};

export function HomeOpening({ locale, hero, name, role, cvHref, lines, experience, aboutLabel, aboutHref }: HomeOpeningProps) {
  const openingRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useOpeningScroll(openingRef, heroRef, textRef);

  return (
    <div className="home-opening" ref={openingRef}>
      <section className="home-hero" ref={heroRef}>
        <HeroShader />
        <div className="hero-fade" aria-hidden="true" />
        <h1>{hero.split('\n').map(line => <span key={line}>{line}</span>)}</h1>
        <p className="hero-caption"><span>{role}</span><span aria-hidden="true">·</span><a href={cvHref} target="_blank" rel="noopener noreferrer">View CV ↗</a></p>
        <a className="hero-orb" href="#at-a-glance" aria-label={locale === 'ko' ? '짧은 소개 보기' : 'A little about me'} />
      </section>

      <section className="home-reveal" id="at-a-glance" aria-labelledby="home-intro-title">
        <div className="home-reveal-identity">
          <p className="home-reveal-name">{name}</p>
          <p className="home-reveal-role">{role}</p>
        </div>
        <IntroReveal lines={lines} ref={textRef} />
        <div className="home-reveal-bottom">
          <p>{experience}</p>
          <a href={aboutHref}>{aboutLabel} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
  );
}
