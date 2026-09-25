'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Locale, localizedPath, Project, site } from '../data/site';

export function Header({ locale, path = '/' }: { locale: Locale; path?: string }) {
  const [open, setOpen] = useState(false);
  const englishPath = path || '/';
  const koreanPath = `/ko${englishPath === '/' ? '/' : englishPath}`;

  return (
    <header className="site-header">
      <Link className="brand" href={localizedPath(locale, '/')}>Taebin Yoo</Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href={localizedPath(locale, '/projects')}>Work <span>01</span></Link>
        <Link href={localizedPath(locale, '/profile')}>About <span>03</span></Link>
        <Link href={localizedPath(locale, '/contact')}>Contact <span>04</span></Link>
      </nav>
      <div className="header-actions">
        <label className="language-picker">
          <span className="sr-only">Select Language</span>
          <select value={locale} onChange={(event) => { window.location.href = event.target.value === 'ko' ? koreanPath : englishPath; }}>
            <option value="en">English</option>
            <option value="ko">Korean (South Korea)</option>
          </select>
        </label>
        <button className={`menu-toggle ${open ? 'is-open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
          <span /><span />
        </button>
      </div>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-links">
          {site.nav.map((item) => (
            <Link key={item.key} href={localizedPath(locale, `/${item.key}`)} onClick={() => setOpen(false)}>
              <span>{item.label}</span><span>{item.number}</span>
            </Link>
          ))}
        </div>
        <div className="mobile-socials">
          <a href={site.socials.instagram}>Instagram</a>
          <a href="#x">X</a>
          <a href={site.socials.youtube}>YouTube</a>
        </div>
      </div>
    </header>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="remix-card">
        <span>Get this for FREE!</span>
        <a href="https://framer.link/nodgKDQ" target="_blank" rel="noreferrer">✣ Remix</a>
      </div>
      <div className="footer-grid">
        <div>
          <span className="footer-label">Pages</span>
          {site.nav.map((item) => <Link key={item.key} href={localizedPath(locale, `/${item.key}`)}>{item.label}</Link>)}
        </div>
        <div>
          <span className="footer-label">Socials</span>
          <a href={site.socials.instagram}>Instagram</a>
          <a href={site.socials.linkedin}>LinkedIn</a>
        </div>
        <div className="footer-signature">
          <strong>Taebin Yoo</strong>
          <small>© 2026 Taebin Yoo. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children, locale, path }: { children: React.ReactNode; locale: Locale; path?: string }) {
  return <><Header locale={locale} path={path} /><main>{children}</main><Footer locale={locale} /></>;
}

export function HeroTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`page-title ${className}`}><h1>{children}</h1></section>;
}

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const localizedQuestion = locale === 'ko'
    ? ({
      'corrective-impulse-response': '물리적 경계를 넘어 공간의 음향적 정체성을 어떻게 재현할 수 있을까?',
      'live-immersive-audio': '몰입형 오디오는 공연자·창작자·관객의 관계를 어떻게 새롭게 구성할 수 있을까?',
      'multichannel-mixing-system': '공간 음향은 공연장에서 관객이 보는 것과 듣는 것을 어떻게 연결할 수 있을까?',
      'wan-audio-transmission': '물리적 거리가 제약이 될 때에도 음악적 협업을 어떻게 이어갈 수 있을까?',
      'electronic-drums': '전자악기는 연주자마다 다른 고유한 다이내믹과 표현을 어떻게 포착할 수 있을까?',
      'audio-to-midi-system': '음악가는 인간의 표현과 디지털 작곡 사이를 어떻게 자연스럽게 오갈 수 있을까?',
      arirang: '역사적 음악을 현대 기술을 통해 어떻게 새롭게 해석할 수 있을까?',
      'adaptive-monitor-system': '서로 다른 청취 방식을 중심으로 음악 시스템을 설계하면 어떤 가능성이 열릴까?',
      'ai-audio-engineering-copilot': '엔지니어링 도구는 전문성을 대체하지 않으면서 인간의 판단을 어떻게 지원할 수 있을까?',
    } as Record<string, string>)[project.slug] : project.question;

  return (
    <article className="project-card">
      <div className="project-media"><Image src={project.image} alt="" width={1200} height={800} loading="lazy" /></div>
      <div className="project-copy">
        <div className="project-meta"><span>{project.year}</span><span>{project.category}</span></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <p className="project-question">{localizedQuestion}</p>
        {project.ongoing && <span className="ongoing">ONGOING RESEARCH</span>}
      </div>
    </article>
  );
}

export function YoutubeEmbed({ playlist = false }: { playlist?: boolean }) {
  const src = playlist
    ? 'https://www.youtube.com/embed/videoseries?list=PL_kWYUD-HpqlcTCfJSD_4k87kQdzyD4DZ'
    : 'https://www.youtube.com/embed/FkPcCPqDZV0';
  return <div className="video-frame"><iframe src={src} title="Taebin Yoo video" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>;
}
