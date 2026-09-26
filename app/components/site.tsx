'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Locale, localizedPath, Project, site } from '../data/site';

const navigation = [
  { label: 'Profile', path: '/profile' },
  { label: 'Projects', path: '/projects' },
  { label: 'Music Production', path: '/music-production' },
  { label: 'Experience', path: '/experience' },
  { label: 'Contact', path: '/contact' },
];

export function Header({ locale, path = '/' }: { locale: Locale; path?: string }) {
  const [open, setOpen] = useState(false);
  const englishPath = path || '/';
  const koreanPath = `/ko${englishPath === '/' ? '/' : englishPath}`;
  return (
    <header className="site-header">
      <a className="brand" href={localizedPath(locale, '/')}>{locale==='ko'?'유태빈':'Taebin Yoo'}</a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(item=><a className={path===item.path?'is-active':''} key={item.label} href={localizedPath(locale,item.path)}>{item.label}</a>)}
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
          {navigation.map((item,index) => (
            <a key={item.label} href={localizedPath(locale, item.path)} onClick={() => setOpen(false)}>
              <span>{item.label}</span><span>{String(index+1).padStart(2,'0')}</span>
            </a>
          ))}
        </div>
        <div className="mobile-socials">
          <a href={site.socials.instagram}>Instagram →</a>
          <a href="#x">X</a>
          <a href={site.socials.youtube}>YouTube →</a>
        </div>
      </div>
    </header>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-simple">
        <nav className="footer-pages" aria-label="Footer navigation">
          <span className="footer-label">{locale==='ko'?'페이지':'Pages'}</span>
          {navigation.map((item) => <a key={item.label} href={localizedPath(locale, item.path)}>{item.label}</a>)}
        </nav>
        <div className="footer-socials">
          <span className="footer-label">Socials</span>
          <a href={site.socials.instagram}>Instagram</a>
          <a href={site.socials.linkedin}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children, locale, path }: { children: React.ReactNode; locale: Locale; path?: string }) {
  return <div className={`site-frame locale-${locale}${path==='/'?' is-home':''}`}><Header locale={locale} path={path} /><main>{children}</main><Footer locale={locale} /></div>;
}

export function HeroTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const projectClass = children === 'Projects' ? 'projects-title' : '';
  return <section className={`page-title ${projectClass} ${className}`}><span className="page-kicker">TAEBIN YOO / PORTFOLIO</span><h1>{children}</h1></section>;
}

export function ProjectCard({ project, locale, compact=false }: { project: Project; locale: Locale; compact?:boolean; minimal?:boolean }) {
  const localizedQuestion = locale === 'ko' ? ({
    'corrective-impulse-response':'현재 공연장에서 다른 홀의 초기 응답과 잔향감을 어떻게 보강할 수 있을까?',
    'spatial-renderer-system-identification':'이머시브 오디오 렌더러는 공간 좌표와 파라미터를 어떻게 스피커별 출력 gain으로 변환할까?',
    'multicannel-mixing-system':'공간 음향은 공연장에서 관객이 보는 것과 듣는 것을 어떻게 연결할 수 있을까?',
    'wan-audio-transmission':'물리적 거리가 제약이 될 때에도 음악적 협업을 어떻게 이어갈 수 있을까?',
    'electronic-drums':'전자악기는 연주자마다 다른 고유한 다이내믹과 표현을 어떻게 포착할 수 있을까?',
    'audio-to-midi-system':'음악가는 인간의 표현과 디지털 작곡 사이를 어떻게 자연스럽게 오갈 수 있을까?',
    'adaptive-monitor-system':'서로 다른 청취 방식을 중심으로 음악 시스템을 설계하면 어떤 가능성이 열릴까?'
  } as Record<string,string>)[project.slug] : project.question;

  return (
    <a className="project-card-link" href={localizedPath(locale, `/projects/${project.slug}`)} aria-label={project.title}>
      <article className="project-card">
        <div className="project-media"><Image src={project.image} alt="" width={1200} height={800} loading="lazy" /></div>
        <div className="project-copy">
          <div className="project-meta"><span>{project.year}</span><span>{project.category}</span></div>
          <h3>{project.title}</h3>
          <p className="project-question">{localizedQuestion}</p>
          {!compact&&project.ongoing && <span className="ongoing">ONGOING RESEARCH</span>}
        </div>
      </article>
    </a>
  );
}

export function YoutubeEmbed({ playlist = false, url }: { playlist?: boolean; url?: string }) {
  let src = playlist
    ? 'https://www.youtube.com/embed/videoseries?list=PL_kWYUD-HpqlcTCfJSD_4k87kQdzyD4DZ'
    : 'https://www.youtube.com/embed/FkPcCPqDZV0';
  if (url) {
    try {
      const parsed = new URL(url);
      const list = parsed.searchParams.get('list');
      const video = parsed.hostname === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
      if (playlist && list) src = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;
      if (!playlist && video) src = `https://www.youtube.com/embed/${encodeURIComponent(video)}`;
    } catch { /* Keep the current embed when the saved link is incomplete. */ }
  }
  return <div className="video-frame"><iframe src={src} title="Taebin Yoo video" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>;
}
