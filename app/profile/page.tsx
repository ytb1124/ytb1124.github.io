import { PageShell, YoutubeEmbed } from '../components/site';
import { site } from '../data/site';
import { koreanProfile } from '../data/korean';
import Image from 'next/image';

export const dynamic='force-static';

export default function ProfilePage({locale='en' as const}:{locale?:'en'|'ko'}) {
  const profile=locale==='ko'?{...site.profile,...koreanProfile}:site.profile;
  return <PageShell locale={locale} path="/profile">
    <section className="profile-hero content-width">
      <div><span className="page-kicker">{locale === 'ko' ? '유태빈 / 소개' : 'TAEBIN YOO / PROFILE'}</span><h1>{profile.title}</h1></div>
      <Image src={site.assets.profileHero} alt={locale === 'ko' ? '어린 시절 무대에서 공연하는 유태빈' : 'Taebin Yoo as a child performing'} width={478} height={478} priority/>
    </section>
    <div className={`profile-content${locale === 'ko' ? ' profile-content-ko' : ''}`}>
      <section className="profile-story">{profile.paragraphs.map(p=><p key={p}>{p}</p>)}</section>
      <section className="profile-collage">{site.assets.profileGallery.map((src)=><Image key={src} src={src} alt="" width={800} height={900}/>)}</section>
      <section className="profile-education">{profile.educationParagraphs.map(p=><p key={p}>{p}</p>)}</section>
      <section className="profile-media"><YoutubeEmbed locale={locale}/><div><h2>{locale === 'ko' ? '팟캐스트' : 'Podcast'}</h2><a className="text-link" href="https://youtu.be/FkPcCPqDZV0?si=xatYoRNts6ZmmDDR">{locale === 'ko' ? '영상 보기 →' : 'WATCH THE VIDEO →'}</a></div></section>
    </div>
  </PageShell>;
}
