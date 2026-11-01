import projectsDocument from '../../content/projects.json';
import siteDocument from '../../content/site.json';

export type Locale = 'en' | 'ko';
export type ProjectResource = { href: string; label: { en: string; ko: string }; localized?: boolean; kind?: 'paper' | 'article' };
export type Project = {
  slug: string;
  hidden?: boolean;
  year: string;
  category: string;
  title: string;
  titleKo?: string;
  summary?: { en: string; ko: string };
  description: string;
  question: string;
  image: string;
  gallery: string[];
  galleryCaptions?: Record<Locale, string>[];
  body: string[];
  video?: string;
  demo?: { src: string; poster: string; captions: Record<Locale, string>; description: Record<Locale, string> };
  reports?: { ko: string; en: string };
  resources?: ProjectResource[];
  repository?: string;
  sources?: { label: string; href: string }[];
  ongoing?: boolean;
  progress?: { label: Record<Locale, string>; state: 'done' | 'planned'; detail: Record<Locale, string> }[];
  contribution?: Record<'problem' | 'design' | 'analysis' | 'tools', Record<Locale, string>>;
  status?: 'Measured study' | 'Working prototype' | 'Research concept' | 'Field experiment' | 'Technical experiment';
  plannedSubmission?: {
    venue: string;
    href: string;
    label: Record<Locale, string>;
    description: Record<Locale, string>;
  };
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

export const allProjects = (projectsDocument as Project[]).filter(project => !project.hidden);

/** Shared card copy for the main catalog and the single-page portfolio. */
export function getProjectSummary(project: Project, locale: Locale) {
  return project.summary?.[locale] ?? (locale === 'en' ? project.description : undefined);
}

export function getProjectResources(project: Project): ProjectResource[] {
  return project.resources ?? (project.reports ? [
    { href: project.reports.ko, label: { en: 'Report (KO) ↗', ko: '한글 보고서 ↗' } },
    { href: project.reports.en, label: { en: 'Report (EN) ↗', ko: '영문 보고서 ↗' } },
  ] : []);
}

export function projectStatusLabel(status: Project['status'], locale: Locale) {
  if (!status) return '';
  const ko = { 'Measured study': '측정·분석', 'Working prototype': '프로토타입', 'Research concept': '구상 단계', 'Field experiment': '현장 실험', 'Technical experiment': '기술 실험' };
  return locale === 'ko' ? ko[status] : status;
}

const sections = (siteDocument.sections as SiteSectionDocument[]).map(({ projectSlugs, ...section }) => ({
  ...section,
  projects: projectSlugs.map((slug) => allProjects.find((project) => project.slug === slug)).filter(Boolean) as Project[],
}));

export const site = { ...siteDocument, sections } as unknown as SiteData;

export const catalogProjects = [...new Map(sections.flatMap(section => section.projects).map(project => [project.slug, project])).values()];

export function localizedPath(locale: Locale, path: string) {
  return locale === 'ko' ? `/ko${path === '/' ? '/' : path}` : path;
}
