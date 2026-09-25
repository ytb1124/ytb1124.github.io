import { PageShell, HeroTitle, ProjectCard } from '../components/site';
import { site } from '../data/site';

export const dynamic = 'force-static';

export default function ProjectsPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  return <PageShell locale={locale} path="/projects"><HeroTitle>Projects</HeroTitle><section className={`research content-width${locale === 'ko' ? ' research-ko' : ''}`}><h2>Research Through Making</h2><p className="research-lede">{locale === 'ko' ? '제 프로젝트는 음악 기술이 어떻게 음악적 환경을 변화시키고, 인간의 표현력을 확장하며, 음악을 경험하는 다양한 방식을 지원할 수 있는지를 탐구합니다.' : 'My projects explore how music technology can transform immersive experiences, expand human musical expression, and support different ways of experiencing music.'}</p>{site.sections.map((section) => <div className="research-section" key={section.number}><h3>{section.number} {locale === 'ko' && section.koreanTitle ? section.koreanTitle : section.title}</h3><p className="research-question">{locale === 'ko' && section.number === '01.' ? section.koreanQuestion : section.question}</p><div className="project-grid">{section.projects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}</div></div>)}</section></PageShell>;
}
