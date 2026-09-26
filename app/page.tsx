import Image from 'next/image';
import { PageShell, ProjectCard, YoutubeEmbed } from './components/site';
import { HeroShader } from './components/hero-shader';
import { allProjects, Locale, localizedPath, site } from './data/site';

export default function HomePage({ locale = 'en' as Locale }: { locale?: Locale }) {
  const home = locale === 'ko' ? site.koreanHome : site.home;
  const featured = ['corrective-impulse-response','electronic-drums','audio-to-midi-system','adaptive-monitor-system'].map(slug=>allProjects.find(project=>project.slug===slug)!);
  return (
    <PageShell locale={locale} path="/">
      <section className="home-hero"><HeroShader /><h1>{site.home.hero.split('\n').map((line) => <span key={line}>{line}</span>)}</h1><span className="hero-orb" /></section>
      <section className="home-intro content-width"><div className="intro-name"><h2>{locale === 'ko' ? site.koreanName : site.name}</h2><p className="intro-copy">{home.intro}</p>{locale === 'en'&&<p className="intro-copy-phone">I work at the intersection of live sound, music technology, and human experience.<br/>My practice explores how technology can change the ways we create,<br/>experience, and participate in music.<br/>Starting from live sound engineering,<br/>I have gradually moved toward immersive audio, interactive systems,<br/>and accessible music technology - always asking how technology can respond to the people who use it.</p>}{locale === 'ko'&&<p className="intro-copy-phone intro-copy-phone-ko">안녕하세요! 저는 인간의 감정과 상호 공감이 공연 음향 기술을 통해 어떻게 전해지는지를 탐구하는 유태빈입니다.<br/><br/><br/>라이브 사운드 엔지니어 배경으로 200개 이상의 라이브 이벤트에서 디자인하고 운영한 현장 경험으로 관객을 이해합니다. 저는 동일한 관객의 입장에서 아티스트와 엔지니어의 예술적 및 기술적 의도가 모든 관객에게 최대한 동등하게 인식될 수 있는 방법을 고민합니다.<br/><br/>현재 저의 작업은 이머시브 오디오와 Max/MSP의 실시간 처리를 연구 도구로 사용하여 공연 시스템에서 영향을 프로토타입하고 테스트합니다.<br/><br/>저는 종종 장애와 같은 이유로 공연에서 소외된 관객들에게 이러한 경험을 확장하는 데 특히 동기를 부여받고 있으며, 인간 중심의 탐구, 접근성, 미래 공연 기술이 만나는 연구 환경을 찾고 있습니다.</p>}<a href={localizedPath(locale, '/profile')}>{locale === 'ko' ? '저에 대해 더 궁금하시다면 눌러주세요!' : 'MORE ABOUT ME →'}</a></div><div className="intro-role"><Image src="/framer/home/portrait.png" alt="Taebin Yoo" width={756} height={1008}/><h3>{home.role}</h3><p>{home.disciplines}</p><a href={localizedPath(locale, '/music-production')}>{locale === 'ko' ? '뮤직 프로덕션 →' : 'MUSIC PRODUCTION →'}</a></div></section>
      <section className="home-quote content-width">
        <h2 className="quote-desktop">{home.quote.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
        {locale === 'ko' ? <><h2 className="quote-mobile quote-mobile-ko-main"><span>그래서 제가 태어난 것만 같아</span><span>요.</span><span>제가 상상할 수 있는 모든 것을 </span><span>경험하기 위해서요.</span></h2><h2 className="quote-mobile quote-mobile-ko-end">천천히, 그러나 꾸준히요!</h2></> : <h2 className="quote-mobile">{["That's why I was born.",'to experience whatever','I can imagine—','slowly, but steadily.'].map((line) => <span key={line}>{line}</span>)}</h2>}
        {home.quoteEnd&&<h3>{home.quoteEnd}</h3>}
      </section>
      <section className={`selected-projects content-width${locale === 'ko' ? ' selected-projects-ko' : ''}`}><div className="section-head"><a href={localizedPath(locale, '/projects')}>View All Projects →</a><h2>{locale === 'ko' ? '최근 프로젝트' : 'Selected Projects'}</h2></div><div className="project-grid">{featured.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} compact />)}</div></section>
      <section className="stage-video home-stage content-width"><div className="section-head"><h2>From the Stage</h2><a href={site.socials.youtube}>MIXING PORTFOLIO →</a></div><YoutubeEmbed playlist /></section>
    </PageShell>
  );
}
