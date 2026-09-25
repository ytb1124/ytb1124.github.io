import { PageShell, HeroTitle, YoutubeEmbed } from '../components/site';
import { site } from '../data/site';
import Image from 'next/image';

export const dynamic = 'force-static';

export default function ProfilePage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  return <PageShell locale={locale} path="/profile">
    <HeroTitle className="image-title"><Image src="/framer/profile/01.jpeg" alt="Taebin Yoo as a child performing" fill priority /><span>{site.profile.title}</span></HeroTitle>
    <section className="prose-columns content-width"><div>{site.profile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div><p>{site.profile.education}</p><YoutubeEmbed /><h2>Podcast</h2><a className="text-link" href={site.socials.notion}>🌟 LIVE SOUND 🌟</a></div></section>
    <section className="profile-collage content-width">{Array.from({length:13},(_,i)=>{const n=String(i+2).padStart(2,'0');const ext=[2,3,4,7,10,11,12,13,14].includes(i+2)?'jpg':'png';return <Image key={n} src={`/framer/profile/${n}.${ext}`} alt="" width={800} height={900}/>})}</section>
  </PageShell>;
}
