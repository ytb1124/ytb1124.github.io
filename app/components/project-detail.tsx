import Image from 'next/image';
import { PageShell } from './site';
import type { Locale, Project } from '../data/site';
export function ProjectDetail({project,locale}:{project:Project;locale:Locale}) {
  return <PageShell locale={locale} path={`/projects/${project.slug}`}><article className="project-detail content-width">
    <div className="detail-intro"><div className="detail-title"><h1>{project.title}</h1><div className="detail-meta"><span>{project.year}</span><span>{project.category}</span></div>{project.ongoing&&<span className="ongoing">ONGOING RESEARCH</span>}{project.reports&&<div className="report-links"><a href={project.reports.ko}>프로젝트 결과 레포트 ↗</a><a href={project.reports.en}>Project Result Report ↗</a></div>}</div><div className="detail-body">{project.body.map((text,i)=><p key={i}>{text}</p>)}{project.sources?.map(source=><p key={source.href}><a href={source.href}>{source.label}: {source.href}</a></p>)}{project.video&&<div className="detail-video"><iframe src={project.video} title={project.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>}</div></div>
    <div className="detail-gallery">{project.gallery.map((src,i)=><div className="gallery-frame" key={src}><Image src={src} alt={`${project.title} ${i+1}`} width={1800} height={1200} priority={i===0}/></div>)}</div>
  </article></PageShell>
}
