import Image from 'next/image';
import { PageShell } from './site';
import type { Locale, Project } from '../data/site';
import { koreanProjectBodies } from '../data/korean';

export function ProjectDetail({project,locale}:{project:Project;locale:Locale}) {
  const body=locale==='ko'?(koreanProjectBodies[project.slug]??project.body):project.body;
  return <PageShell locale={locale} path={`/projects/${project.slug}`}><article className={`project-detail content-width project-${project.slug} locale-${locale}`}>
    <div className="detail-intro">
      <div className="detail-title">
        <h1>{project.title}</h1>
        <div className="detail-meta"><span>{project.year}</span><span>{project.category}</span></div>
        <div className="report-links">{project.reports?<><a href={project.reports.ko}>📄 프로젝트 결과 PDF 한글 레포트 다운로드</a><a href={project.reports.en}>📄 Project Result PDF English Report Download</a></>:<><span>📄 프로젝트 결과 PDF 한글 레포트 다운로드</span><span>📄 Project Result PDF English Report Download</span></>}</div>
      </div>
      <div className="detail-body">
        {body.map((text,i)=><p key={i}>{text}</p>)}
        {project.sources&&<p className="detail-sources"><span>{locale==='ko'?'출처':'Sources'}</span>{project.sources.map(source=><span key={source.href}><br/><a href={source.href}>{locale==='ko'?(source.label.startsWith('Byeonsa')?'변사 / 음원 참고':'영상 출처'):source.label}: {source.href}</a></span>)}</p>}
        {project.video&&<div className="detail-video"><iframe src={project.video} title={project.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>}
      </div>
    </div>
    <div className="detail-gallery">{project.gallery.map((src,i)=><div className="gallery-frame" key={src}><Image src={src} alt={`${project.title} ${i+1}`} width={1800} height={1200} priority={i===0}/></div>)}</div>
  </article></PageShell>
}
