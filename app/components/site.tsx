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
        {site.nav.map(item=><Link key={item.key} href={localizedPath(locale,`/${item.key}`)}>{item.label}</Link>)}
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
  const projectClass = children === 'Projects' ? 'projects-title' : '';
  return <section className={`page-title ${projectClass} ${className}`}><h1>{children}</h1></section>;
}

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const localizedQuestion = project.question;

  return (
    <Link className="project-card-link" href={localizedPath(locale, `/projects/${project.slug}`)}>
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
    </Link>
  );
}

export function YoutubeEmbed({ playlist = false }: { playlist?: boolean }) {
  const src = playlist
    ? 'https://www.youtube.com/embed/videoseries?list=PL_kWYUD-HpqlcTCfJSD_4k87kQdzyD4DZ'
    : 'https://www.youtube.com/embed/FkPcCPqDZV0';
  return <div className="video-frame"><iframe src={src} title="Taebin Yoo video" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>;
}
