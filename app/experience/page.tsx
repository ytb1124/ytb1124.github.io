import { PageShell } from '../components/site';
import { localizedPath, site } from '../data/site';
import { koreanExperience } from '../data/korean';

export const dynamic = 'force-static';

export default function ExperiencePage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const copy = site.pageContent[locale].experience;
  const exp = ko ? { ...site.experience, ...koreanExperience } : site.experience;
  return <PageShell locale={locale} path="/experience">
    <div className="experience-essential overview-page">
      <header className="overview-header header-with-action"><div><span className="section-eyebrow">{copy.eyebrow}</span><h1>{exp.title}</h1></div><a className="pill-link" href={site.socials.cv} target="_blank" rel="noopener noreferrer">{ko ? 'CV 보기 ↗' : 'View CV ↗'}</a></header>
      <section className="education-line" aria-label={ko ? '학력' : 'Education'}><strong>{copy.school}</strong><span>{copy.degree} · {copy.period}</span><span>{copy.gpa}</span></section>
      <section className="career-highlights" aria-labelledby="career-heading">
        <h2 id="career-heading">{ko ? '주요 경력' : 'Selected experience'}</h2>
        {copy.highlights.map(([period,role,org,description]) => <article className="career-line" key={role}><time>{period}</time><div><h3>{role}</h3><span>{org}</span></div><p>{description}</p></article>)}
        <a className="text-link career-work-link" href={localizedPath(locale,'/music-production')}>{ko ? '공연과 음악 제작 작업 보기 →' : 'See my sound and music work →'}</a>
      </section>
      <section id="selected-writing" className="writing-essential">
        <h2>{ko ? '발표와 기고' : 'Selected Writing & Presentations'}</h2>
        <div className="writing-project"><a href={localizedPath(locale,'/projects/corrective-impulse-response')}>{copy.writingProject}</a><span>{copy.writingAward}</span></div>
        <article><span className="writing-type">{ko ? '학회 발표' : 'Conference paper'}</span><div><a href={ko ? '/reports/corrective-ir-paper-ko.pdf' : '/reports/corrective-ir-paper-en.pdf'} target="_blank" rel="noopener noreferrer">{copy.paperTitle} ↗</a><p>{copy.paperCitation}</p></div></article>
        <article><span className="writing-type">{ko ? '매거진 기고' : 'Magazine article'}</span><div><a lang="ko" href="/reports/corrective-ir-ssm-vol19-ko.pdf" target="_blank" rel="noopener noreferrer">{copy.magazineTitle}</a><p>{copy.magazineCitation}</p></div></article>
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
