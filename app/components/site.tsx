'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Locale, localizedPath, Project, site } from '../data/site';

const navigation = [
  { label: 'Profile', koreanLabel: '소개', path: '/profile' },
  { label: 'Projects', koreanLabel: '프로젝트', path: '/projects' },
  { label: 'Music Production', koreanLabel: '음악 제작', path: '/music-production' },
  { label: 'Experience', koreanLabel: '경력', path: '/experience' },
  { label: 'Contact', koreanLabel: '연락처', path: '/contact' },
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
  const [open, setOpen] = useState(false);
  const englishPath = path || '/';
  const koreanPath = `/ko${englishPath === '/' ? '/' : englishPath}`;
  return (
    <header className="site-header">
      <a className="brand" href={localizedPath(locale, '/')}>{locale==='ko'?'유태빈':'Taebin Yoo'}</a>
      <nav className="desktop-nav" aria-label={locale === 'ko' ? '주요 메뉴' : 'Primary navigation'}>
        {navigation.map(item=><a className={path===item.path?'is-active':''} key={item.label} href={localizedPath(locale,item.path)}>{locale === 'ko' ? item.koreanLabel : item.label}</a>)}
      </nav>
      <div className="header-actions">
        <label className="language-picker">
          <span className="sr-only">{locale === 'ko' ? '언어 선택' : 'Select language'}</span>
          <select value={locale} onChange={(event) => { window.location.href = event.target.value === 'ko' ? koreanPath : englishPath; }}>
            <option value="en">{locale === 'ko' ? '영어' : 'English'}</option>
            <option value="ko">{locale === 'ko' ? '한국어' : 'Korean'}</option>
          </select>
        </label>
        <button className={`menu-toggle ${open ? 'is-open' : ''}`} aria-label={open ? (locale === 'ko' ? '메뉴 닫기' : 'Close menu') : (locale === 'ko' ? '메뉴 열기' : 'Open menu')} onClick={() => setOpen((value) => !value)}>
          <span /><span />
        </button>
      </div>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-links">
          {navigation.map((item,index) => (
            <a key={item.label} href={localizedPath(locale, item.path)} onClick={() => setOpen(false)}>
              <span>{locale === 'ko' ? item.koreanLabel : item.label}</span><span>{String(index+1).padStart(2,'0')}</span>
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
        <nav className="footer-pages" aria-label={locale === 'ko' ? '하단 메뉴' : 'Footer navigation'}>
          <span className="footer-label">{locale==='ko'?'페이지':'Pages'}</span>
          {navigation.map((item) => <a key={item.label} href={localizedPath(locale, item.path)}>{locale === 'ko' ? item.koreanLabel : item.label}</a>)}
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
  return <div className={`site-frame locale-${locale}${path==='/'?' is-home':''}`}><Header locale={locale} path={path} /><main>{children}</main><Footer locale={locale} /></div>;
}

export function HeroTitle({ children, className = '', locale = 'en' }: { children: React.ReactNode; className?: string; locale?: Locale }) {
  const projectClass = children === 'Projects' ? 'projects-title' : '';
  return <section className={`page-title ${projectClass} ${className}`}><span className="page-kicker">{locale === 'ko' ? '유태빈 / 포트폴리오' : 'TAEBIN YOO / PORTFOLIO'}</span><h1>{children}</h1></section>;
}

export function ProjectCard({ project, locale, compact=false }: { project: Project; locale: Locale; compact?:boolean; minimal?:boolean }) {
  const localizedQuestion = locale === 'ko' ? ({
    'corrective-impulse-response':'전기음향 보정으로 현재 공연장의 초기 응답과 잔향 특성을 다른 홀에 얼마나 가깝게 만들 수 있을까?',
    'spatial-renderer-system-identification':'Sound xR Image는 공간 좌표와 렌더링 파라미터를 어떻게 스피커별 출력 게인으로 바꿀까?',
    'multicannel-mixing-system':'공간 음향은 공연장에서 관객이 보는 것과 듣는 것을 어떻게 연결할 수 있을까?',
    'wan-audio-transmission':'물리적 거리가 제약이 될 때에도 음악적 협업을 어떻게 이어갈 수 있을까?',
    'electronic-drums':'전자드럼의 벨로시티 반응을 개별 연주자의 타격 특성에 맞게 어떻게 재구성할 수 있을까?',
    'audio-to-midi-system':'AI가 공연 준비의 반복 작업을 줄이면서 음악적 결정은 창작자에게 남겨둘 수 있을까?',
    'adaptive-monitor-system':'서로 다른 청취 방식을 중심으로 음악 시스템을 설계하면 어떤 가능성이 열릴까?'
  } as Record<string,string>)[project.slug] : project.question;

  return (
    <a className="project-card-link" href={localizedPath(locale, `/projects/${project.slug}`)} aria-label={project.title}>
      <article className="project-card">
        <div className="project-media"><Image src={project.image} alt="" width={1200} height={800} loading="lazy" /></div>
        <div className="project-copy">
          <div className="project-meta"><span>{project.year}</span><span>{locale === 'ko' ? (koreanCategories[project.category] ?? project.category) : project.category}</span></div>
          <h3>{project.title}</h3>
          <p className="project-question">{localizedQuestion}</p>
          {!compact&&project.ongoing && <span className="ongoing">{locale === 'ko' ? '진행 중인 연구' : 'ONGOING RESEARCH'}</span>}
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
