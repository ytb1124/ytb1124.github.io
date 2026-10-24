import { PageIntro } from './page-intro';
import Image from 'next/image';
import { musicProduction } from '../data/music-production';
import { site, type Locale } from '../data/site';
import { PageShell, YoutubeEmbed } from './site';
import { LiveCredits } from './live-credits';

export function MusicProduction({ locale }: { locale: Locale }) {
  const ko = locale === 'ko';
  return <PageShell locale={locale} path="/music-production"><div className="music-overview overview-page">
    <PageIntro eyebrow={ko?'공연 · 녹음 · 믹싱':'LIVE SOUND · RECORDING · MIXING'} title={ko?'음악 제작':'Music Production'} description={site.pageContent[locale].music.intro} />
    <nav className="section-jumps" aria-label={ko?'음악 제작 분야':'Music production sections'}><a href="#production-projects">{ko?'주요 작업':'Selected projects'} ↓</a><a href="#recording-mixing">{ko?'녹음과 믹싱':'Recording & mixing'} ↓</a><a href="#live-credits">{ko?'공연 기록':'Live sound credits'} ↓</a></nav>
    <section id="production-projects" className="production-picks">
      <div className="compact-section-head"><h2>{musicProduction.selectedProjects.title[locale]}</h2></div>
      <div className="production-pick-grid">
        {musicProduction.selectedProjects.projects.map(project => <details className="production-pick" key={project.id}>
          <summary className="production-pick-summary">
            <div className="production-pick-top">
              <Image src={project.image} alt="" width={600} height={400}/>
              <div>
                <span className="production-focus">{project.category[locale]}</span>
                <h3>{ko ? project.titleKo ?? project.title : project.title}</h3>
                <span className="production-year">{project.year}</span>
              </div>
            </div>
            <p>{project.question[locale]}</p>
            <span className="production-toggle">{ko ? '작업 과정과 사진' : 'Process & photos'}<span aria-hidden="true">＋</span></span>
          </summary>
          <div className="production-pick-details">
            {project.body[locale].map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <div className="production-resource-links">
              <a className="text-link" href={project.videoUrl} target="_blank" rel="noopener noreferrer">{ko ? '영상 보기 ↗' : 'Watch video ↗'}</a>
              {project.reports && <a className="text-link" href={project.reports[locale]} target="_blank" rel="noopener noreferrer">{ko ? '보고서 읽기 ↗' : 'Read report ↗'}</a>}
            </div>
            <YoutubeEmbed url={project.videoUrl} locale={locale}/>
            {!!project.sources.length && <div className="selected-project-sources">
              <span>{ko ? '참고 자료' : 'Sources'}</span>
              {project.sources.map(source => <a href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>{ko ? (source.label.startsWith('Byeonsa') ? '변사 음성·음원 자료' : '영상 자료') : source.label} ↗</a>)}
            </div>}
            <div className="production-photos">{project.gallery.slice(1).map(src => <Image key={src} src={src} alt="" width={600} height={400} loading="lazy"/>)}</div>
          </div>
        </details>)}
      </div>
    </section>
    <section id="recording-mixing" className="recording-mixing"><div className="compact-section-head"><h2>{ko?'녹음과 믹싱':'Recording & mixing'}</h2></div><div className="recording-mixing-grid"><article className="recording-compact"><a href={musicProduction.studio.playlistUrl} target="_blank" rel="noopener noreferrer"><Image src={musicProduction.studio.cover} alt="Merry Night" width={200} height={200}/></a><div><span className="section-eyebrow">{ko?'스튜디오 녹음 · 2026':'STUDIO RECORDING · 2026'}</span><h3>{musicProduction.studio.albumTitle}</h3><p>{musicProduction.studio.note[locale]}</p><a className="text-link" href={musicProduction.studio.playlistUrl} target="_blank" rel="noopener noreferrer">{ko?'앨범 듣기 ↗':'Listen to the album ↗'}</a><section className="album-track-details"><h4 className="always-visible-heading">{ko?'곡 목록':'Track list'}</h4><ol>{musicProduction.studio.tracks.map(track=><li key={track.title}><span>{track.title}</span><time>{track.duration}</time></li>)}</ol></section></div></article><article className="mixing-compact"><span className="section-eyebrow">{ko?'라이브 믹싱':'LIVE MIXING'}</span><h3>{musicProduction.mixing.title[locale]}</h3><p>{musicProduction.mixing.description[locale]}</p><a className="text-link" href={musicProduction.mixing.playlistUrl} target="_blank" rel="noopener noreferrer">{ko?'YouTube에서 듣기 ↗':'Listen on YouTube ↗'}</a></article></div></section>
    <section id="live-credits" className="live-credits-section"><div className="compact-section-head"><h2>{ko ? '공연 참여 기록' : musicProduction.credits.title}</h2></div><LiveCredits locale={locale}/></section>
  </div></PageShell>;
}
