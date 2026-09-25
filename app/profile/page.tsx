import { PageShell, HeroTitle, YoutubeEmbed } from '../components/site';
import { site } from '../data/site';
import Image from 'next/image';

export const dynamic = 'force-static';

export default function ProfilePage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  return <PageShell locale={locale} path="/profile">
    <HeroTitle className="image-title"><Image src="/images/profile-hero.jpg" alt="Taebin Yoo as a child performing" fill priority /><span>{locale === 'ko' ? 'Background' : site.profile.title}</span></HeroTitle>
    <section className="prose-columns content-width"><div>{site.profile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div><p>{site.profile.education}</p><YoutubeEmbed /><h2>Podcast</h2><a className="text-link" href={site.socials.notion}>🌟 LIVE SOUND 🌟</a></div></section>
  </PageShell>;
}
