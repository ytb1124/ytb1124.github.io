import { PageShell, HeroTitle, YoutubeEmbed } from '../components/site';
import { site } from '../data/site';
import { koreanExperience } from '../data/korean';

export const dynamic = 'force-static';

function RecordGroup({ title, rows }: { title: string; rows: readonly (readonly [string, string, string])[] }) {
  return <section className="record-group"><h2>{title}</h2>{rows.map(([name, org, year]) => <div className="record" key={`${name}-${year}`}><strong>{name}</strong><span>{org}</span><time>{year}</time></div>)}</section>;
}

export default function ExperiencePage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const exp = locale==='ko'?{...site.experience,...koreanExperience}:site.experience;
  return <PageShell locale={locale} path="/experience"><HeroTitle><span>{exp.title.split('\n').map((line) => <span key={line}>{line}</span>)}</span></HeroTitle><section className={`content-width cv-intro${locale === 'ko' ? ' cv-intro-ko' : ''}`}><h2>{exp.cvTitle}</h2><p>{exp.cvDescription}</p><div className="button-row"><a className="pill-link" href={site.socials.cv}>Download CV (PDF)</a><a className="pill-link" href={site.socials.liveHistory}>Live Sound History</a></div></section><div className="records content-width"><RecordGroup title="Experience" rows={exp.entries} /><RecordGroup title="License & Certification" rows={exp.licenses} /><RecordGroup title="Education" rows={exp.education} /><RecordGroup title="Scholarship" rows={exp.scholarships} /><RecordGroup title="Awards" rows={exp.awards} /></div><section className="content-width stage-video"><YoutubeEmbed playlist /><div className="video-links"><h2>Mixing Portfolio</h2><a className="text-link" href={site.socials.youtube}>🌟 &lt;LINK&gt; LIVE SOUND</a><h2>Live Sound History</h2><a className="text-link" href={site.socials.notion}>🌟 &lt;LINK&gt; LIVE SOUND</a></div></section></PageShell>;
}
