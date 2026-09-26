import musicProductionDocument from '../../content/music-production.json';

export type LocalizedText = { en: string; ko: string };

export type MusicProductionContent = {
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
