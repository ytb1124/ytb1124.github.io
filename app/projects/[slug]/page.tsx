import { notFound } from 'next/navigation';
import { ProjectDetail } from '../../components/project-detail';
import { allProjects } from '../../data/site';
export const dynamic='force-static';
export function generateStaticParams(){return allProjects.map(project=>({slug:project.slug}))}
export default function Page({params}:{params:{slug:string}}){const project=allProjects.find(p=>p.slug===params.slug);if(!project)notFound();return <ProjectDetail project={project} locale="en"/>}
