import { PageShell, YoutubeEmbed } from '../components/site';
import { site } from '../data/site';
import { koreanProfile } from '../data/korean';
import Image from 'next/image';

export const dynamic='force-static';

export default function ProfilePage({locale='en' as const}:{locale?:'en'|'ko'}) {
  const profile=locale==='ko'?{...site.profile,...koreanProfile}:site.profile;
  const education=[
    'At my father’s recommendation—he has worked in education—I chose not to attend high school after finishing middle school. Instead, I earned my high school equivalency certificate and, at 16 years old, entered the Department of Audio Production at DIMA as the top-ranked applicant in the early admissions track.',
    'During the COVID-19 period, I explored a wide range of experiences, including running an online shopping business, and later completed my mandatory military service (at Presient Security Service).',
    'After being discharged, and before returning to school, I spent two months in Vancouver and took a cross-continental train journey from Vancouver to New York. That experience continues to shape how I see people and culture, and today I also work as a Korean language tutor on Preply.'
  ];
  const photos=[2,3,5,7,8,11,12,13,10,14,9];
  return <PageShell locale={locale} path="/profile">
    <section className="page-title image-title"><Image src="/framer/profile/01.jpeg" alt="Taebin Yoo as a child performing" fill priority/><h1><span>{profile.title}</span></h1></section>
    <div className={`profile-content${locale === 'ko' ? ' profile-content-ko' : ''}`}>
      <section className="profile-story">{profile.paragraphs.map(p=><p key={p}>{p}</p>)}</section>
      <section className="profile-collage">{photos.map(i=>{const n=String(i).padStart(2,'0');const ext=[2,3,7,10,11,12,13,14].includes(i)?'jpg':'png';return <Image key={n} src={`/framer/profile/${n}.${ext}`} alt="" width={800} height={900}/>})}</section>
      <section className="profile-education">{education.map(p=><p key={p}>{p}</p>)}</section>
      <section className="profile-media"><YoutubeEmbed/><div><h2>Podcast</h2><a className="text-link" href={site.socials.notion}>🌟 &lt;LINK&gt; LIVE SOUND</a></div></section>
    </div>
  </PageShell>;
}
