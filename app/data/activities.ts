import activitiesDocument from '../../content/activities.json';

export type Activity = {
  id: string;
  title: string;
  englishTitle: string;
  eventType: string;
  year: string;
  image: string;
  role: 'Mixing Engineer' | 'System Engineer' | 'Technician' | '애매함!';
};

export const activities = activitiesDocument as Activity[];
