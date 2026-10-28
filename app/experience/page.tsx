import { PageIntro } from '../components/page-intro';
import { PageShell } from '../components/site';
import { allProjects, localizedPath, site } from '../data/site';
import { koreanExperience } from '../data/korean';
import { getSelectedWriting } from '../data/writing';

export const dynamic = 'force-static';

export default function ExperiencePage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const copy = site.pageContent[locale].experience;
  const exp = ko ? { ...site.experience, ...koreanExperience } : site.experience;
  const plannedSubmission = allProjects.find(project => project.slug === 'corrective-impulse-response')?.plannedSubmission;
  return <PageShell locale={locale} path="/experience">
    <div className="experience-essential overview-page">
      <PageIntro eyebrow={copy.eyebrow} title={exp.title}
        aside={<a className="pill-link" href={site.socials.cv} target="_blank" rel="noopener noreferrer">{ko ? 'CV 보기 ↗' : 'View CV ↗'}</a>}
      />
      <section className="education-line" aria-label={ko ? '학력' : 'Education'}><strong>{copy.school}</strong><span>{copy.degree} · {copy.period}</span><span>{copy.gpa}</span></section>
      <section className="career-highlights" aria-labelledby="career-heading">
        <h2 id="career-heading">{ko ? '주요 경력' : 'Selected experience'}</h2>
        {copy.highlights.map(([period,role,org,description]) => <article className="career-line" key={role}><time>{period}</time><div><h3>{role}</h3><span>{org}</span></div><p>{description}</p></article>)}
        <a className="text-link career-work-link" href={localizedPath(locale,'/music-production')}>{ko ? '공연과 음악 제작 작업 보기 →' : 'See my sound and music work →'}</a>
      </section>
      <section id="selected-writing" className="writing-essential">
        <h2>{ko ? '발표와 기고' : 'Selected Writing & Presentations'}</h2>
        <div className="writing-project"><a href={localizedPath(locale,'/projects/corrective-impulse-response')}>{copy.writingProject}</a><span>{copy.writingAward}</span></div>
        {plannedSubmission && <article><span className="writing-type">{plannedSubmission.label[locale]}</span><div><a href={plannedSubmission.href} target="_blank" rel="noopener noreferrer">{plannedSubmission.venue} ↗</a><p>{plannedSubmission.description[locale]}</p></div></article>}
        {getSelectedWriting(locale).map(publication => {
          const primaryLink = publication.links.find(link => locale === 'ko' ? link.label.en.includes('(KO)') : link.label.en.includes('(EN)')) ?? publication.links[0];
          return <article key={publication.id}><span className="writing-type">{publication.kind}</span><div>{primaryLink ? <a lang={publication.lang} href={primaryLink.href} target="_blank" rel="noopener noreferrer">{publication.title} ↗</a> : <span lang={publication.lang}>{publication.title}</span>}<p>{publication.citation}</p></div></article>;
        })}
      </section>
      <section className="experience-extra"><h2 className="always-visible-heading">{ko ? '기타 경력 · 장학금 · 자격' : 'Other experience, scholarships & qualifications'}</h2>
        <div className="extra-columns"><section><h3>{ko ? '기타 경력' : 'Other experience'}</h3><ul>
          <li><strong>{copy.churchRole}</strong><span>{copy.churchDescription}</span></li>
          <li><strong>{copy.tutorRole}</strong><span>{copy.tutorDescription}</span></li>
          <li><strong>{copy.militaryRole}</strong><span>{copy.militaryDescription}</span></li>
        </ul></section><section><h3>{ko ? '장학금' : 'Scholarships'}</h3><ul>{exp.scholarships.map(([name,org,year]) => <li key={name}><strong>{name}</strong><span>{org} · {year}</span></li>)}</ul></section><section><h3>{ko ? '자격과 교육' : 'Certifications & training'}</h3><ul>{exp.licenses.map(([name,org,year]) => <li key={name}><strong>{name}</strong><span>{org} · {year}</span></li>)}</ul></section></div>
      </section>
    </div>
  </PageShell>;
}
