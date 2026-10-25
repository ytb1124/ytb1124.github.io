import { PageIntro } from '../components/page-intro';
import { PageShell, ProjectCard } from '../components/site';
import { site } from '../data/site';
import { SingleLineQuestion } from '../components/single-line-question';

export const dynamic = 'force-static';

export default function ProjectsPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const copy = site.pageContent[locale].projects;
  const questionSteps = copy.stages;
  return <PageShell locale={locale} path="/projects">
    <div className="research-catalog overview-page">
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />
      <nav className="question-progression" aria-labelledby="question-progression-title">
        <h2 id="question-progression-title">{copy.progressionTitle}</h2>
        <ol>
          {site.sections.map((section,index) => <li key={section.number}>
            <a href={`#research-${index + 1}`}>
              <span className="question-stage"><span>{section.number}</span>{questionSteps[index]}</span>
              <SingleLineQuestion>{ko ? section.koreanQuestion : section.question}</SingleLineQuestion>
            </a>
            {index < 2 && <span className="question-next" aria-hidden="true">→</span>}
          </li>)}
        </ol>
      </nav>
      {site.sections.map((section, index) => <section className="catalog-group" id={`research-${index + 1}`} key={section.number}>
        <header className="catalog-group-head">
          <span>{section.number}</span>
          <div><h2>{ko ? section.koreanTitle : section.title}</h2><p>{ko ? section.koreanQuestion : section.question}</p></div>
        </header>
        <div className="catalog-grid">{section.projects.map(project => <ProjectCard key={project.slug} project={project} locale={locale} />)}</div>
      </section>)}
    </div>
  </PageShell>;
}
