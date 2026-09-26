import koreanDocument from '../../content/korean.json';
import type { ExperienceData } from './site';

export const koreanProjectBodies = koreanDocument.projectBodies as Record<string, string[]>;
export const koreanProfile = koreanDocument.profile;
export const koreanExperience = koreanDocument.experience as unknown as ExperienceData;
