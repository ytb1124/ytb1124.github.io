import Link from 'next/link';
import { PageShell, ProjectCard, YoutubeEmbed } from './components/site';
import { Locale, localizedPath, site } from './data/site';

export default function HomePage({ locale = 'en' as Locale }: { locale?: Locale }) {
  const home = locale === 'ko' ? site.koreanHome : site.home;
  const featured = site.sections.flatMap((section) => section.projects).slice(0, 4);
  return (
    <PageShell locale={locale} path="/">
      <section className="home-hero"><div className="hero-vignette" /><h1>{site.home.hero.split('\n').map((line) => <span key={line}>{line}</span>)}</h1><span className="hero-orb" /></section>
      <section className="home-intro content-width"><div className="intro-name"><h2>{locale === 'ko' ? site.koreanName : site.name}</h2><p>{home.intro}</p><Link href={localizedPath(locale, '/profile')}>{locale === 'ko' ? '저에 대해 더 궁금하시다면 눌러주세요!' : 'MORE ABOUT ME →'}</Link></div><div className="intro-role"><h3>{home.role}</h3><p>{home.disciplines}</p><a href={site.socials.notion}>{locale === 'ko' ? '참여한 공연 음향 엔지니어 포트폴리오 →' : 'LIVE SOUND PORTFOLIO →'}</a></div></section>
      <section className="home-quote content-width"><h2>{home.quote.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><h3>{home.quoteEnd}</h3></section>
      <section className="selected-projects content-width"><div className="section-head"><Link href={localizedPath(locale, '/projects')}>View All Projects →</Link><h2>{locale === 'ko' ? '최근 프로젝트' : 'Selected Projects'}</h2></div><div className="project-grid">{featured.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}</div></section>
      <section className="stage-video content-width"><div className="section-head"><h2>From the Stage</h2><a href={site.socials.youtube}>MIXING PORTFOLIO →</a></div><YoutubeEmbed playlist /></section>
    </PageShell>
  );
}
