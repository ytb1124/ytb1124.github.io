import { allProjects, type Locale } from './site';

type Localized = Record<Locale, string>;
type Contribution = { problem: Localized; design: Localized; analysis: Localized; tools: Localized };

export const contributions = Object.fromEntries(
  allProjects.filter(project => project.contribution).map(project => [project.slug, project.contribution]),
) as Record<string, Contribution>;
