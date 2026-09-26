import { PageShell, HeroTitle, ProjectCard } from '../components/site';
import { site } from '../data/site';

export const dynamic = 'force-static';

export default function ProjectsPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  return <PageShell locale={locale} path="/projects">
    <HeroTitle>Projects</HeroTitle>
    <section className={`research content-width${locale === 'ko' ? ' research-ko' : ''}`}>
      <header className="research-intro">
        <span>SELECTED WORK / 2025—2026</span>
        <h2>Research Through Making</h2>
        <p className="research-lede">
          <strong>{locale === 'ko' ? '사람이 기술에 맞추는 것이 아니라, 기술이 사람에게 맞춰지는 시스템을 만듭니다.' : 'I build systems that adapt to people—not the other way around.'}</strong>
          <span>{locale === 'ko' ? '저의 작업은 기술이 공간과 개인의 표현, 그리고 음악을 경험하고 참여하는 서로 다른 방식에 어떻게 반응할 수 있는지를 탐구합니다.' : 'My work explores how technology can respond to space, individual expression, and different ways of experiencing and participating in music.'}</span>
        </p>
      </header>
      <nav className="research-map" aria-label="Research directions">
        {site.sections.map((section, index) => <div className="research-map-step" key={section.number}>
          <a href={`#research-${index + 1}`}>
            <span>{section.number}</span>
            <strong>{locale === 'ko' && section.koreanTitle ? section.koreanTitle : section.title}</strong>
            <p>{locale === 'ko' ? section.koreanQuestion : section.question}</p>
          </a>
          {index < site.sections.length - 1 && <span className="research-map-arrow" aria-hidden="true">↓</span>}
        </div>)}
      </nav>
      {site.sections.map((section, index) => <div className="research-section" id={`research-${index + 1}`} key={section.number}>
        <div className="research-heading"><span>{section.number}</span><div><h3>{locale === 'ko' && section.koreanTitle ? section.koreanTitle : section.title}</h3><p className="research-question">{locale === 'ko' ? section.koreanQuestion : section.question}</p></div></div>
        <div className="project-grid">{section.projects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} minimal />)}</div>
      </div>)}
    </section>
  </PageShell>;
}
