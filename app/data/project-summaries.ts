import summariesDocument from '../../content/project-summaries.json';

export type ProjectSummary = {
  question: string;
  system: string;
  methods: string;
  result: string;
  next: string;
};

type LocalizedSummary = { en: ProjectSummary; ko: ProjectSummary };

export const projectSummaries = summariesDocument as Record<string, LocalizedSummary>;
