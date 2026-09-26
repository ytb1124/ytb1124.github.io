import musicProductionDocument from '../../content/music-production.json';

export type LocalizedText = { en: string; ko: string };

export type MusicProductionContent = {
  selectedProjects: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    projects: {
      id: string;
      year: string;
      category: LocalizedText;
      title: string;
      question: LocalizedText;
      image: string;
      gallery: string[];
      videoUrl: string;
      body: { en: string[]; ko: string[] };
      videoLabel: LocalizedText;
      reports: LocalizedText | null;
      reportLabel: LocalizedText | null;
      sources: { label: string; href: string }[];
    }[];
  };
  studio: {
    eyebrow: LocalizedText;
    title: string;
    cover: string;
    coverAlt: string;
    credit: LocalizedText;
    albumTitle: string;
    meta: string;
    tracks: { title: string; duration: string }[];
    note: LocalizedText;
  };
  mixing: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    linkLabel: LocalizedText;
    playlistUrl: string;
  };
  credits: {
    eyebrow: LocalizedText;
    title: string;
  };
};

export const musicProduction = musicProductionDocument as MusicProductionContent;
