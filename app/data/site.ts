import projectsDocument from '../../content/projects.json';
import siteDocument from '../../content/site.json';

export type Locale = 'en' | 'ko';
export type ProjectResource = { href: string; label: { en: string; ko: string }; localized?: boolean };
export type Project = {
  slug: string;
  year: string;
  category: string;
  title: string;
  description: string;
  question: string;
  image: string;
  gallery: string[];
  body: string[];
  video?: string;
  reports?: { ko: string; en: string };
  resources?: ProjectResource[];
  repository?: string;
  sources?: { label: string; href: string }[];
  ongoing?: boolean;
};

type SiteSectionDocument = Omit<(typeof siteDocument.sections)[number], 'projectSlugs'> & {
  projectSlugs: string[];
};

export type ExperienceData = {
  title: string;
  cvTitle?: string;
  cvDescription: string;
  entries: [string, string, string][];
  licenses: [string, string, string][];
  education: [string, string, string][];
  scholarships: [string, string, string][];
  awards: [string, string, string][];
};

type SiteSection = Omit<SiteSectionDocument, 'projectSlugs'> & { projects: Project[] };
type SiteData = Omit<typeof siteDocument, 'sections' | 'experience'> & {
  sections: SiteSection[];
  experience: ExperienceData;
};

export const allProjects = projectsDocument as Project[];

const sections = (siteDocument.sections as SiteSectionDocument[]).map(({ projectSlugs, ...section }) => ({
  ...section,
  projects: projectSlugs.map((slug) => allProjects.find((project) => project.slug === slug)).filter(Boolean) as Project[],
}));

export const site = { ...siteDocument, sections } as unknown as SiteData;

export function localizedPath(locale: Locale, path: string) {
  return locale === 'ko' ? `/ko${path === '/' ? '/' : path}` : path;
}
