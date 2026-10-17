import Image from 'next/image';
import { PageShell } from './site';
import { site, localizedPath, projectStatusLabel, type Locale, type Project } from '../data/site';
import { koreanProjectBodies } from '../data/korean';
import { projectSummaries } from '../data/project-summaries';
import { ContributionBox, ProjectEvidence } from './project-evidence';

export function ProjectDetail({project,locale}:{project:Project;locale:Locale}) {
  const ko = locale === 'ko';
  const title = ko ? project.titleKo ?? project.title : project.title;
  const body = ko ? koreanProjectBodies[project.slug] ?? project.body : project.body;
  const summary = projectSummaries[project.slug]?.[locale];
  const resources = project.resources ?? (project.reports ? [
    {href:project.reports.ko,label:{en:'Report (KO) ↗',ko:'한글 보고서 ↗'}},
    {href:project.reports.en,label:{en:'Report (EN) ↗',ko:'영문 보고서 ↗'}},
  ] : []);
  return <PageShell locale={locale} path={`/projects/${project.slug}`}>
    <article className={`project-detail detail-review project-${project.slug} locale-${locale}`}>
      <header className="detail-title">
        <a className="detail-back" href={localizedPath(locale,'/projects')}>{ko ? '← 전체 프로젝트' : '← All projects'}</a>
        <div className="detail-meta"><span>{project.year}</span><span className="project-status">{projectStatusLabel(project.status,locale)}</span></div>
        <h1>{title}</h1>
        <p className="detail-question">{summary?.question ?? project.question}</p>
        {(resources.length>0||project.repository)&&<div className="report-links">{resources.map(resource=>{
          const href=resource.localized?localizedPath(locale,resource.href):resource.href;
          return <a href={href} {...(!resource.localized?{target:'_blank',rel:'noopener noreferrer'}:{})} key={resource.href}>{resource.label[locale]}</a>;
        })}{project.repository&&<a href={project.repository} target="_blank" rel="noopener noreferrer">{ko?'코드 보기 ↗':'View code ↗'}</a>}</div>}
      </header>
      {summary&&<section className="detail-takeaways"><div><h2>{project.status==='Research concept'?(ko?'현재 단계':'Current stage'):(project.status==='Working prototype'&&project.slug!=='corrective-impulse-response'?(ko?'구현한 기능':'What works so far'):(ko?'확인한 결과':'Findings'))}</h2><p>{summary.result}</p></div><div><h2>{ko?'다음 단계':'Next step'}</h2><p>{summary.next}</p></div></section>}
      <div className="detail-overview"><ProjectEvidence slug={project.slug} locale={locale}/><ContributionBox slug={project.slug} locale={locale}/></div>
      <section className="project-depth"><h2 className="always-visible-heading">{ko?'작업 과정과 사진':'Process & photos'}</h2>
        <div className="detail-body">{body.map((text,i)=><p key={i}>{text}</p>)}
          {project.sources&&<p className="detail-sources">{ko?'참고 자료':'Sources'}{project.sources.map(source=><span key={source.href}><br/><a href={source.href}>{source.label} ↗</a></span>)}</p>}
          {project.video&&<div className="detail-video"><iframe src={project.video} title={title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/></div>}
        </div>
        <div className="detail-gallery">{project.gallery.map((src,i)=><div className="gallery-frame" key={src}><Image src={src} alt={`${title} ${i+1}`} width={1800} height={1200} loading="lazy"/></div>)}</div>
      </section>
    </article>
  </PageShell>;
}
