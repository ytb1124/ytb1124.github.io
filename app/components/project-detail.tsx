import Image from 'next/image';
import { PageShell } from './site';
import { site, type Locale, type Project } from '../data/site';
import { koreanProjectBodies } from '../data/korean';
import { projectSummaries } from '../data/project-summaries';

export function ProjectDetail({project,locale}:{project:Project;locale:Locale}) {
  const body=locale==='ko'?(koreanProjectBodies[project.slug]??project.body):project.body;
  const section=site.sections.find(item=>item.projects.some(candidate=>candidate.slug===project.slug));
  const summary=projectSummaries[project.slug]?.[locale];
  const framework=summary ? [
    ['Question', summary.question],
    ['System', summary.system],
    ['Methods', summary.methods],
    ['Result', summary.result],
    ['Next', summary.next],
  ] : [['Question', project.question]];
  return <PageShell locale={locale} path={`/projects/${project.slug}`}><article className={`project-detail content-width project-${project.slug} locale-${locale}`}>
    <header className="detail-title">
        <span className="detail-kicker">PROJECT SHOWCASE / {project.year}</span>
        <h1>{project.title}</h1>
        <div className="detail-meta"><span>{project.year}</span><span>{project.category}</span></div>
        {project.reports&&<div className="report-links"><a href={project.reports.ko} target="_blank" rel="noopener noreferrer">{locale==='ko'?'한글 보고서 열기 →':'OPEN KOREAN REPORT →'}</a><a href={project.reports.en} target="_blank" rel="noopener noreferrer">{locale==='ko'?'영문 보고서 열기 →':'OPEN ENGLISH REPORT →'}</a></div>}
    </header>
    <section className="project-framework" aria-label="Project research summary">
      {framework.map(([label,value])=><div className="framework-row" key={label}><span>{label}</span><p>{value}</p></div>)}
    </section>
    <div className="detail-intro">
      <aside className="detail-aside"><span>{locale==='ko'?'연구 기록':'Research Narrative'}</span><strong>{locale==='ko'?(section?.koreanTitle??section?.title):section?.title}</strong></aside>
      <div className="detail-body">
        {body.map((text,i)=><p key={i}>{text}</p>)}
        {project.sources&&<p className="detail-sources"><span>{locale==='ko'?'출처':'Sources'}</span>{project.sources.map(source=><span key={source.href}><br/><a href={source.href}>{locale==='ko'?(source.label.startsWith('Byeonsa')?'변사 / 음원 참고 →':'영상 출처 →'):`${source.label.toUpperCase()} →`}</a></span>)}</p>}
        {project.video&&<div className="detail-video"><iframe src={project.video} title={project.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>}
      </div>
    </div>
    <div className="detail-gallery">{project.gallery.map((src,i)=><div className="gallery-frame" key={src}><Image src={src} alt={`${project.title} ${i+1}`} width={1800} height={1200} priority={i===0}/></div>)}</div>
  </article></PageShell>
}
