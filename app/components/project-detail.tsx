import Image from 'next/image';
import { PageShell } from './site';
import { localizedPath, projectStatusLabel, type Locale, type Project } from '../data/site';
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
      {project.plannedSubmission && <section className="project-next-step">
        <h2>{project.plannedSubmission.label[locale]}</h2>
        <p><a href={project.plannedSubmission.href} target="_blank" rel="noopener noreferrer">{project.plannedSubmission.venue} ↗</a><br/>{project.plannedSubmission.description[locale]}</p>
      </section>}
      {project.progress && <section className="research-progress" aria-labelledby="progress-title">
        <header><h2 id="progress-title">{ko?'연구 진행 상황':'Research progress'}</h2><p>{ko?'완료한 작업과 앞으로 검증할 내용을 구분합니다.':'Completed work and planned validation, shown separately.'}</p></header>
        <ol>{project.progress.map(step=><li key={step.label.en} data-state={step.state}><span className="milestone-state">{step.state==='done'?(ko?'완료':'Completed'):(ko?'진행 전':'Not started')}</span><h3>{step.label[locale]}</h3><p>{step.detail[locale]}</p></li>)}</ol>
      </section>}
      <div className="detail-overview"><ProjectEvidence slug={project.slug} locale={locale}/><ContributionBox slug={project.slug} locale={locale}/></div>
      {summary&&<div className="project-next-step"><h2>Next step</h2><p>{summary.next}</p></div>}
      <section className="project-depth"><h2 className="always-visible-heading">{project.status==='Research concept'?(ko?'연구 방향과 구현 계획':'Research direction & proposed build'):(ko?'작업 과정과 사진':'Process & photos')}</h2>
        <div className="detail-body">{body.map((text,i)=><p key={i}>{text}</p>)}
          {project.sources&&<p className="detail-sources">{ko?'참고 자료':'Sources'}{project.sources.map(source=><span key={source.href}><br/><a href={source.href}>{source.label} ↗</a></span>)}</p>}
          {project.video&&<div className="detail-video"><iframe src={project.video} title={title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/></div>}
        </div>
        <div className="detail-gallery">{project.gallery.map((src,i)=>{
          const caption = project.galleryCaptions?.[i]?.[locale];
          return caption ? <figure className="gallery-frame screenshot-frame" key={src}>
            <Image src={src} alt={caption} width={1265} height={712} loading="lazy"/>
            <figcaption>{caption}</figcaption>
          </figure> : <div className="gallery-frame" key={src}><Image src={src} alt={`${title} ${i+1}`} width={1800} height={1200} loading="lazy"/></div>;
        })}</div>
      </section>
    </article>
  </PageShell>;
}
