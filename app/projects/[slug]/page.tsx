import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageShell } from '../../components/site';
import { allProjects } from '../../data/site';

export const dynamic = 'force-static';
export function generateStaticParams() { return allProjects.map((project) => ({ slug: project.slug })); }

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((item) => item.slug === params.slug);
  if (!project) notFound();
  return (
    <PageShell locale="en" path={`/projects/${project.slug}`}>
      <article className="project-detail content-width">
        <Link className="back-link" href="/projects">← All projects</Link>
        <div className="project-detail-meta"><span>{project.year}</span><span>{project.category}</span></div>
        <h1>{project.title}</h1>
        {project.ongoing && <span className="ongoing">ONGOING RESEARCH</span>}
        <div className="project-detail-image"><Image src={project.image} alt="" width={1600} height={1000} priority /></div>
        <div className="project-detail-grid">
          <div><span className="detail-label">Research question</span><p className="detail-question">{project.question}</p></div>
          <div><span className="detail-label">About this project</span><p>{project.description}</p></div>
        </div>
        <Link className="back-link detail-back" href="/projects">← Back to projects</Link>
      </article>
    </PageShell>
  );
}
