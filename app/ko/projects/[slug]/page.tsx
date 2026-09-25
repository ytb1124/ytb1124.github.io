import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageShell } from '../../../components/site';
import { allProjects } from '../../../data/site';

export const dynamic = 'force-static';
export function generateStaticParams() { return allProjects.map((project) => ({ slug: project.slug })); }

const koreanQuestions: Record<string, string> = {
  'corrective-impulse-response': '물리적 경계를 넘어 공간의 음향적 정체성을 어떻게 재현할 수 있을까?',
  'live-immersive-audio': '몰입형 오디오는 공연자·창작자·관객의 관계를 어떻게 새롭게 구성할 수 있을까?',
  'multichannel-mixing-system': '공간 음향은 공연장에서 관객이 보는 것과 듣는 것을 어떻게 연결할 수 있을까?',
  'wan-audio-transmission': '물리적 거리가 제약이 될 때에도 음악적 협업을 어떻게 이어갈 수 있을까?',
  'electronic-drums': '전자악기는 연주자마다 다른 고유한 다이내믹과 표현을 어떻게 포착할 수 있을까?',
  'audio-to-midi-system': '음악가는 인간의 표현과 디지털 작곡 사이를 어떻게 자연스럽게 오갈 수 있을까?',
  arirang: '역사적 음악을 현대 기술을 통해 어떻게 새롭게 해석할 수 있을까?',
  'adaptive-monitor-system': '서로 다른 청취 방식을 중심으로 음악 시스템을 설계하면 어떤 가능성이 열릴까?',
  'ai-audio-engineering-copilot': '엔지니어링 도구는 전문성을 대체하지 않으면서 인간의 판단을 어떻게 지원할 수 있을까?',
};

export default function KoreanProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((item) => item.slug === params.slug);
  if (!project) notFound();
  return (
    <PageShell locale="ko" path={`/projects/${project.slug}`}>
      <article className="project-detail content-width">
        <Link className="back-link" href="/ko/projects">← 프로젝트 전체 보기</Link>
        <div className="project-detail-meta"><span>{project.year}</span><span>{project.category}</span></div>
        <h1>{project.title}</h1>
        {project.ongoing && <span className="ongoing">ONGOING RESEARCH</span>}
        <div className="project-detail-image"><Image src={project.image} alt="" width={1600} height={1000} priority /></div>
        <div className="project-detail-grid">
          <div><span className="detail-label">연구 질문</span><p className="detail-question">{koreanQuestions[project.slug] ?? project.question}</p></div>
          <div><span className="detail-label">프로젝트 소개</span><p>{project.description}</p></div>
        </div>
        <Link className="back-link detail-back" href="/ko/projects">← 프로젝트 전체 보기</Link>
      </article>
    </PageShell>
  );
}
