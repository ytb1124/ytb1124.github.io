import Image from 'next/image';
import { PageShell, ProjectCard } from './components/site';
import { HeroShader } from './components/hero-shader';
import { allProjects, Locale, localizedPath, site } from './data/site';

export default function HomePage({ locale = 'en' as Locale }: { locale?: Locale }) {
  const home = locale === 'ko' ? site.koreanHome : site.home;
  const featured = site.featuredProjectSlugs.map(slug=>allProjects.find(project=>project.slug===slug)!).filter(Boolean);
  return (
    <PageShell locale={locale} path="/">
      <section className="home-hero"><HeroShader /><h1>{site.home.hero.split('\n').map((line) => <span key={line}>{line}</span>)}</h1><span className="hero-orb" /></section>
      <section className="home-intro content-width"><div className="intro-name"><h2>{locale === 'ko' ? site.koreanName : site.name}</h2><p className="intro-copy">{home.intro}</p><p className={`intro-copy-phone${locale === 'ko' ? ' intro-copy-phone-ko' : ''}`}>{home.intro}</p><a href={localizedPath(locale, '/profile')}>{locale === 'ko' ? '저에 대해 더 궁금하시다면 눌러주세요!' : 'MORE ABOUT ME →'}</a><ol className="intro-credentials">{home.credentials.split('\n').map((credential,index)=><li key={credential}><span>{String(index+1).padStart(2,'0')}</span><strong>{credential}</strong></li>)}</ol></div><div className="intro-role"><Image src={site.assets.homePortrait} alt="Taebin Yoo" width={756} height={1008}/><h3>{home.role}</h3><p>{home.disciplines}</p><a href={localizedPath(locale, '/music-production')}>{locale === 'ko' ? '뮤직 프로덕션 →' : 'MUSIC PRODUCTION →'}</a></div></section>
      <section className="home-quote content-width">
        <h2 className="quote-desktop">{home.quote.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
        {locale === 'ko' ? <><h2 className="quote-mobile quote-mobile-ko-main"><span>그래서 제가 태어난 것만 같아</span><span>요.</span><span>제가 상상할 수 있는 모든 것을 </span><span>경험하기 위해서요.</span></h2><h2 className="quote-mobile quote-mobile-ko-end">천천히, 그러나 꾸준히요!</h2></> : <h2 className="quote-mobile">{["That's why I was born.",'to experience whatever','I can imagine—','slowly, but steadily.'].map((line) => <span key={line}>{line}</span>)}</h2>}
        {home.quoteEnd&&<h3>{home.quoteEnd}</h3>}
      </section>
      <section className={`selected-projects content-width${locale === 'ko' ? ' selected-projects-ko' : ''}`}><div className="section-head"><a href={localizedPath(locale, '/projects')}>View All Projects →</a><h2>{locale === 'ko' ? '최근 프로젝트' : 'Selected Projects'}</h2></div><div className="project-grid">{featured.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} compact />)}</div></section>
    </PageShell>
  );
}
