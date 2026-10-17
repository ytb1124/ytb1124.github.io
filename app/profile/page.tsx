import { PageShell, YoutubeEmbed } from '../components/site';
import { site, localizedPath } from '../data/site';
import { koreanProfile } from '../data/korean';
import Image from 'next/image';

export const dynamic = 'force-static';

export default function ProfilePage({locale='en' as const}:{locale?:'en'|'ko'}) {
  const ko = locale === 'ko';
  const copy = site.pageContent[locale].profile;
  const profile = ko ? {...site.profile,...koreanProfile} : site.profile;
  const storySections = [
    { title: copy.storySections[0], paragraphs: profile.paragraphs.slice(0, 2) },
    { title: copy.storySections[1], paragraphs: profile.paragraphs.slice(2) },
    { title: copy.storySections[2], paragraphs: profile.educationParagraphs },
  ];
  return <PageShell locale={locale} path="/profile">
    <div className="about-overview overview-page">
      <header className="about-intro"><div><span className="section-eyebrow">{ko ? '유태빈' : 'TAEBIN YOO'}</span><h1>{profile.title}</h1><p>{copy.intro}</p><a className="text-link" href={localizedPath(locale,'/experience')}>{ko ? '학력과 경력 보기 →' : 'Education and experience →'}</a></div><Image src={site.assets.homePortrait} alt={ko ? '유태빈' : 'Taebin Yoo'} width={300} height={400} priority /></header>
      <section className="about-research"><div><h2>{copy.originTitle}</h2><p>{copy.origin}</p></div><div><h2>{copy.futureTitle}</h2><p>{copy.future}</p></div></section>
      <section className="profile-story-details"><h2 className="always-visible-heading">{copy.storyTitle}</h2><div className="story-reader">{storySections.map(section => <section className="story-section" key={section.title}><h3>{section.title}</h3><div className="story-copy">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div><div className="profile-collage">{site.assets.profileGallery.map(src=><Image key={src} src={src} alt="" width={800} height={900} loading="lazy"/>)}</div><section className="profile-media"><YoutubeEmbed locale={locale}/><div><h2>{ko ? '팟캐스트' : 'Podcast'}</h2><a className="text-link" href="https://youtu.be/FkPcCPqDZV0?si=xatYoRNts6ZmmDDR">{ko ? '이야기 들어보기 ↗' : 'Watch the conversation ↗'}</a></div></section></section>
    </div>
  </PageShell>;
}
