import { PageIntro } from '../components/page-intro';
import { PageShell, ProjectCard } from '../components/site';
import { site } from '../data/site';

export const dynamic = 'force-static';

export default function ProjectsPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const copy = site.pageContent[locale].projects;
  return <PageShell locale={locale} path="/projects">
    <div className="research-catalog overview-page">
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />
      <div className="question-progression">
        <p className="research-motto">Unity without Uniformity.</p>
        <p className="research-motto-copy"><span>Different ways of experiencing and expressing music.</span><span>One shared musical experience.</span></p>
      </div>
      {site.sections.map((section, index) => <section className="catalog-group" id={`research-${index + 1}`} key={section.number}>
        <header className="catalog-group-head">
          <span>{section.number}</span>
          <div><h2>{ko ? section.koreanTitle : section.title}</h2><p>{ko ? section.koreanQuestion : section.question}</p></div>
        </header>
        <div className="catalog-grid">{section.projects.map((project, projectIndex) => <ProjectCard key={project.slug} project={project} locale={locale} eager={index === 0 && projectIndex < 2} />)}</div>
      </section>)}
    </div>
  </PageShell>;
}
