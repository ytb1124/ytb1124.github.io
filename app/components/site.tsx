'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { projectSummaries } from '../data/project-summaries';
import { Locale, localizedPath, Project, site, projectStatusLabel } from '../data/site';

const navigation = [
  { label: 'About', koreanLabel: '소개', path: '/profile' },
  { label: 'Projects', koreanLabel: '프로젝트', path: '/projects' },
  { label: 'Music Production', koreanLabel: '음악 제작', path: '/music-production' },
  { label: 'Experience', koreanLabel: '경력', path: '/experience' },
  { label: 'Contact', koreanLabel: '연락처', path: '/contact' },
  { label: 'CV ↗', koreanLabel: 'CV ↗', path: '/reports/taebin-yoo-cv.pdf', external: true },
];

const koreanCategories: Record<string, string> = {
  'ACOUSTICS SYSTEM': '공간 음향 시스템',
  'SPATIAL AUDIO RESEARCH': '공간 음향 연구',
  'IMMERSIVE AUDIO': '몰입형 오디오',
  'NETWORK AUDIO': '네트워크 오디오',
  'INTERACTIVE INSTRUMENT': '인터랙티브 악기',
  'AI MUSIC TOOL': 'AI 음악 도구',
  'ACCESSIBLE MUSIC TECHNOLOGY': '접근 가능한 음악 기술',
};

export function Header({ locale, path = '/' }: { locale: Locale; path?: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const englishPath = path || '/';
  const koreanPath = `/ko${englishPath === '/' ? '/' : englishPath}`;
  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <a className="brand" href={localizedPath(locale, '/')}>{locale==='ko'?'유태빈':'Taebin Yoo'}</a>
      <nav className="desktop-nav" aria-label={locale === 'ko' ? '주요 메뉴' : 'Primary navigation'}>
        {navigation.filter(item => !item.external).map(item=>{
          const active = path === item.path || path?.startsWith(`${item.path}/`);
          return <a className={active?'is-active':''} aria-current={active?'page':undefined} key={item.label} href={localizedPath(locale,item.path)}>{locale === 'ko' ? item.koreanLabel : item.label}</a>;
        })}
      </nav>
      <div className="header-actions">
        <label className="language-picker">
          <span className="sr-only">{locale === 'ko' ? '언어 선택' : 'Select language'}</span>
          <select aria-label={locale === 'ko' ? '언어 선택' : 'Select language'} value={locale} onChange={(event) => {
            const currentUrl = new URL(document.URL);
            const destination = new URL(event.target.value === 'ko' ? koreanPath : englishPath, currentUrl);
            destination.hash = currentUrl.hash;
            window.location.assign(destination.href);
          }}>
            <option value="en">{locale === 'ko' ? '영어' : 'English'}</option>
            <option value="ko">{locale === 'ko' ? '한국어' : 'Korean'}</option>
          </select>
        </label>
      </div>
    </header>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-simple">
        <nav className="footer-pages" aria-label={locale === 'ko' ? '하단 메뉴' : 'Footer navigation'}>
          <span className="footer-label">{locale==='ko'?'페이지':'Pages'}</span>
          {navigation.map((item) => <a key={item.label} href={item.external?item.path:localizedPath(locale, item.path)} {...(item.external?{target:'_blank',rel:'noopener noreferrer'}:{})}>{locale === 'ko' ? item.koreanLabel : item.label}</a>)}
        </nav>
        <div className="footer-socials">
          <span className="footer-label">{locale === 'ko' ? '소셜 미디어' : 'Socials'}</span>
          <a href={site.socials.instagram}>Instagram</a>
          <a href={site.socials.linkedin}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children, locale, path }: { children: React.ReactNode; locale: Locale; path?: string }) {
  return <div lang={locale} className={`site-frame locale-${locale}${path==='/'?' is-home':''}`}><Header locale={locale} path={path} /><main>{children}</main><Footer locale={locale} /></div>;
}

export function HeroTitle({ children, className = '', locale = 'en' }: { children: React.ReactNode; className?: string; locale?: Locale }) {
  const projectClass = children === 'Projects' ? 'projects-title' : '';
  return <section className={`page-title ${projectClass} ${className}`}><span className="page-kicker">{locale === 'ko' ? '유태빈 / 포트폴리오' : 'TAEBIN YOO / PORTFOLIO'}</span><h1>{children}</h1></section>;
}

export function ProjectCard({ project, locale, compact=false }: { project: Project; locale: Locale; compact?:boolean; minimal?:boolean }) {
  const localizedQuestion = locale === 'ko' ? projectSummaries[project.slug]?.ko?.question ?? project.question : project.question;

  return (
    <a className="project-card-link" href={localizedPath(locale, `/projects/${project.slug}`)} aria-label={locale==='ko'?(project.titleKo??project.title):project.title}>
      <article className={`project-card${compact?' is-compact':''}`}>
        <div className="project-media">{project.slug==='listening-tool-ci'?<div className="concept-cover"><span>{locale==='ko'?'CI 인터랙티브 합주실 · 프로토타입':'CI ENSEMBLE ROOM · PROTOTYPE'}</span><strong>{locale==='ko'?'단서를 찾고,\n노래로 돌아가기.':'Find a cue.\nReturn to the song.'}</strong><div>{locale==='ko'?'소리 맞춤 / 악기 믹싱 / 단서 탐색':'Sound setup / Stem mixing / Cue exploration'}</div><small>{locale==='ko'?'핑크노이즈 시험판 · 사용자 평가 전':'Pink-noise audio · User evaluation planned'}</small></div>:<Image src={project.image} alt="" width={1200} height={800} loading="lazy" />}</div>
        <div className="project-copy">
          <div className="project-meta"><span>{project.year}</span><span>{locale === 'ko' ? (koreanCategories[project.category] ?? project.category) : project.category}</span></div>
          <h3>{locale==='ko'?(project.titleKo??project.title):project.title}</h3>
          {project.status && <span className="project-status">{projectStatusLabel(project.status,locale)}</span>}
          <p className="project-question">{localizedQuestion}</p>
          {project.summary && <p className="project-result">{project.summary[locale]}</p>}
        </div>
      </article>
    </a>
  );
}

export function YoutubeEmbed({ playlist = false, url, locale = 'en' }: { playlist?: boolean; url?: string; locale?: Locale }) {
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
  return <div className="video-frame"><iframe src={src} title={locale === 'ko' ? '유태빈 영상' : 'Taebin Yoo video'} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>;
}
