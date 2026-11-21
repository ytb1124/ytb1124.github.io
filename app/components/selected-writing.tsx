import { WritingCitation } from './writing-citation';
import { allProjects, Locale } from '../data/site';
import { getSelectedWriting } from '../data/writing';

/** Papers, presentations and articles, with the planned submission first. */
export function SelectedWriting({ locale, heading }: { locale: Locale; heading?: string }) {
  const plannedSubmission = allProjects.find(project => project.slug === 'corrective-impulse-response')?.plannedSubmission;
  return <section id="selected-writing" className="writing-essential" aria-label={heading ? undefined : (locale === 'ko' ? '논문과 발표' : 'Publications')}>
    {heading && <h2>{heading}</h2>}
    {plannedSubmission && <article><span className="writing-type">{plannedSubmission.label[locale]}</span><div><a href={plannedSubmission.href} target="_blank" rel="noopener noreferrer">{plannedSubmission.venue} ↗</a><p>{plannedSubmission.description[locale]}</p></div></article>}
    {getSelectedWriting(locale).map(publication => {
      const primaryLink = publication.links.find(link => link.label.en.includes('(KO)')) ?? publication.links[0];
      return <article key={publication.id}>
        <span className="writing-type">{publication.kind}</span>
        <div>
          <WritingCitation publication={publication} titleHref={primaryLink?.href} />
          {publication.award && <p className="writing-award">{publication.award}</p>}
        </div>
      </article>;
    })}
  </section>;
}
