import Image from 'next/image';
import { PageShell, ProjectCard } from './components/site';
import { HeroShader } from './components/hero-shader';
import { allProjects, Locale, localizedPath, site } from './data/site';
import narrative from '../content/home-narrative.json';
import './home.css';

export default function HomePage({ locale = 'en' as Locale }: { locale?: Locale }) {
  const home = locale === 'ko' ? site.koreanHome : site.home;
  const copy = narrative[locale];
  const featured = site.featuredProjectSlugs.map(slug=>allProjects.find(project=>project.slug===slug)!).filter(Boolean);
  return (
    <PageShell locale={locale} path="/">
      <section className="home-hero">
        <HeroShader />
        <h1>{home.hero.split('\n').map(line => <span key={line}>{line}</span>)}</h1>
        <p className="hero-caption"><span>Music Technology</span><span aria-hidden="true">·</span><span>Sound Engineer</span><span aria-hidden="true">·</span><a href={site.socials.cv} target="_blank" rel="noopener noreferrer">View CV ↗</a></p>
        <a className="hero-orb" href="#at-a-glance" aria-label={locale === 'ko' ? '짧은 소개 보기' : 'A little about me'} />
      </section>
      <section className="home-brief" id="at-a-glance" aria-labelledby="home-intro-title">
        <div>
          <h2 id="home-intro-title">{locale === 'ko' ? '유태빈' : site.name}</h2>
          <p className="home-brief-role">{home.role}</p>
        </div>
        <div className="home-brief-copy">
          <p>{home.intro}</p>
          <div className="home-brief-bottom">
            <span>{copy.experience}</span>
            <a href={localizedPath(locale, '/profile')}>{copy.aboutLink} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="selected-projects content-width home-featured" aria-labelledby="home-projects-title">
        <div className="section-head">
          <a href={localizedPath(locale, '/projects')}>{locale === 'ko' ? '모든 프로젝트 보기 →' : 'View All Projects →'}</a>
          <h2 id="home-projects-title">{locale === 'ko' ? '대표 프로젝트' : 'Selected Projects'}</h2>
        </div>
        <p className="home-featured-intro">{copy.workIntro}</p>
        <div className="project-grid">{featured.map(project => <ProjectCard key={project.slug} project={project} locale={locale} compact />)}</div>
      </section>

      <section className="home-inquiry" aria-labelledby="home-inquiry-title">
        <header className="home-inquiry-heading">
          <div>
            <h2 id="home-inquiry-title">{copy.directionTitle}</h2>
          </div>
          <p>{copy.directionIntro}</p>
        </header>
        <ol className="home-inquiry-path">
          {copy.steps.map((step, index) => (
            <li key={step.title}>
              <div className="home-inquiry-marker"><span>{String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">{index < 2 ? '→' : '↗'}</span></div>
              <p className="home-inquiry-focus">{step.focus}</p>
              <h3>{step.title}</h3>
              <h4>{step.question}</h4>
              <p className="home-inquiry-body">{step.body}</p>
              <div className="home-inquiry-links">{step.links.map(link => <a key={link.slug} href={localizedPath(locale, `/projects/${link.slug}`)}>{link.label} <span aria-hidden="true">↗</span></a>)}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-closing" aria-labelledby="home-story-title">
        <div className="home-story">
          <div className="home-story-image"><Image src={site.assets.homePortrait} alt={locale === 'ko' ? '유태빈' : 'Taebin Yoo'} width={756} height={1008} loading="lazy" /></div>
          <div className="home-story-copy">
            <h2 id="home-story-title">{home.quote.split('\n').filter(Boolean).map((line, index) => <span key={index}>{line}</span>)}</h2>
            <p>{copy.story}</p>
            <a className="home-inline-link" href={localizedPath(locale, '/profile')}>{copy.storyLink} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="home-contact">
          <div><h3>{copy.contactTitle}</h3><p>{copy.contactCopy}</p></div>
          <div className="home-contact-links"><a className="home-email" href={site.contact.emailHref}>{site.contact.email} <span aria-hidden="true">↗</span></a><a className="home-inline-link" href={localizedPath(locale, '/contact')}>{copy.contactLink} <span aria-hidden="true">→</span></a></div>
        </div>
      </section>
    </PageShell>
  );
}
