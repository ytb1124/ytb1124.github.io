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
        <p className="research-lede">{locale === 'ko' ? '세 가지 연구 축은 공간, 연주자, 그리고 서로 다른 감각과 표현 방식에 기술이 어떻게 적응할 수 있는지를 탐구합니다.' : 'Three research directions connect the projects: how technology can adapt to spaces, performers, and different ways of experiencing and expressing music.'}</p>
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
