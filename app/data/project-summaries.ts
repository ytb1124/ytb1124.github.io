import summariesDocument from '../../content/project-summaries.json';

export type ProjectSummary = {
  question: string;
  build: string;
  findOut: string;
  system: string;
  methods: string;
  result: string;
  next: string;
  limitation: string;
  lesson: string;
};

type LocalizedSummary = { en: ProjectSummary; ko: ProjectSummary };

export const projectSummaries = summariesDocument as Record<string, LocalizedSummary>;
