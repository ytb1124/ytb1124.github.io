import { allProjects, getProjectResources, type Locale, site } from './site';

/** Both writing lists read the original titles, citations, and project resources. */
export function getSelectedWriting(locale: Locale) {
  const copy = site.pageContent[locale].experience;
  const project = allProjects.find(item => item.slug === 'corrective-impulse-response');
  const resources = project ? getProjectResources(project) : [];
  return [
    {
      id: 'conference-paper',
      kind: locale === 'ko' ? '학회 발표' : 'Conference paper',
      title: copy.paperTitle,
      citation: copy.paperCitation,
      award: copy.writingAward,
      lang: locale,
      links: resources.filter(resource => resource.kind === 'paper'),
    },
    {
      id: 'magazine-article',
      kind: locale === 'ko' ? '매거진 기고' : 'Magazine article',
      title: copy.magazineTitle.replace(/\s*↗$/, ''),
      citation: copy.magazineCitation,
      lang: 'ko',
      links: resources.filter(resource => resource.kind === 'article'),
    },
  ].filter(item => project && item.title);
}
