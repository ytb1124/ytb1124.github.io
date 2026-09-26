/* oxlint-disable next/no-img-element */
import Image from 'next/image';
import { activities } from '../data/activities';
import { musicProduction } from '../data/music-production';
import type { Locale } from '../data/site';
import { HeroTitle, PageShell, YoutubeEmbed } from './site';

export function MusicProduction({ locale }: { locale: Locale }) {
  const ko = locale === 'ko';
  const language = ko ? 'ko' : 'en';

  return <PageShell locale={locale} path="/music-production">
    <HeroTitle>Music Production</HeroTitle>
    <div className="production-showcase">
      <section className="selected-projects" aria-labelledby="selected-projects-title">
        <header className="selected-projects-heading">
          <h2 id="selected-projects-title">{musicProduction.selectedProjects.title[language]}</h2>
        </header>
        <div className="selected-project-list">
          {musicProduction.selectedProjects.projects.map((project,index) => <article className="selected-project" key={project.id}>
            <div className="selected-project-cover"><Image src={project.image} alt={project.title} width={1800} height={1200} priority={index === 0} /></div>
            <header className="selected-project-header">
              <div>
                <p className="selected-project-meta">{project.year} · {project.category[language]}</p>
                <h3>{project.title}</h3>
                <p className="selected-project-question">{project.question[language]}</p>
              </div>
            </header>
            <div className="selected-project-story">
              <div className="selected-project-body">
                {project.body[language].map((paragraph,paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                <div className="selected-project-links">
                  <a className="text-link" href={project.videoUrl} target="_blank" rel="noopener noreferrer">{project.videoLabel[language]}</a>
                  {project.reports && project.reportLabel && <a className="text-link" href={project.reports[language]} target="_blank" rel="noopener noreferrer">{project.reportLabel[language]}</a>}
                </div>
                {!!project.sources.length && <div className="selected-project-sources"><span>{ko ? '자료 출처' : 'Sources'}</span>{project.sources.map((source) => <a href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>{source.label} ↗</a>)}</div>}
              </div>
              <YoutubeEmbed url={project.videoUrl} />
            </div>
            {project.gallery.length > 1 && <div className="selected-project-gallery">
              {project.gallery.slice(1).map((image,index) => <Image src={image} alt={`${project.title} ${index + 2}`} width={1200} height={900} key={image} />)}
            </div>}
          </article>)}
        </div>
      </section>

      <section className="production-section recording-section" aria-labelledby="studio-recording-title">
        <div className="production-heading">
          <span>01</span>
          <div><p>{musicProduction.studio.eyebrow[language]}</p><h2 id="studio-recording-title">{musicProduction.studio.title}</h2></div>
        </div>
        <div className="album-feature">
          <Image src={musicProduction.studio.cover} alt={musicProduction.studio.coverAlt} width={540} height={540} priority />
          <div className="album-details">
            <p className="album-credit">{musicProduction.studio.credit[language]}</p>
            <h3>{musicProduction.studio.albumTitle}</h3>
            <p className="album-meta">{musicProduction.studio.meta}</p>
            <ol className="album-tracks">
              {musicProduction.studio.tracks.map((track,index)=><li key={`${track.title}-${index}`}><span>{String(index+1).padStart(2,'0')}</span><strong>{track.title}</strong><time>{track.duration}</time></li>)}
            </ol>
            <p className="album-note">{musicProduction.studio.note[language]}</p>
          </div>
        </div>
      </section>

      <section className="production-section mixing-section" aria-labelledby="mixing-portfolio-title">
        <div className="production-heading">
          <span>02</span>
          <div><p>{musicProduction.mixing.eyebrow[language]}</p><h2 id="mixing-portfolio-title">{musicProduction.mixing.title[language]}</h2></div>
        </div>
        <div className="mixing-feature">
          <div className="mixing-copy"><p>{musicProduction.mixing.description[language]}</p><a className="text-link" href={musicProduction.mixing.playlistUrl} target="_blank" rel="noopener noreferrer">{musicProduction.mixing.linkLabel[language]}</a></div>
          <YoutubeEmbed playlist url={musicProduction.mixing.playlistUrl} />
        </div>
      </section>

      <section className="production-section live-sound-section" aria-labelledby="live-sound-title">
        <div className="production-heading">
          <span>03</span>
          <div><p>{musicProduction.credits.eyebrow[language]}</p><h2 id="live-sound-title">{musicProduction.credits.title}</h2></div>
        </div>
        <div className="activity-gallery" aria-label={ko ? '라이브 사운드 활동 이력' : 'Live sound credits'}>
          {activities.map((activity) => <article className="activity-card" key={activity.id}>
            <div className="activity-media">
              {activity.image ? <img src={activity.image} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <div className="activity-placeholder" aria-hidden="true">♪</div>}
            </div>
            <div className="activity-meta">
              <div className="activity-title-group">
                <h2>{ko ? activity.title : activity.englishTitle}</h2>
                <span>{activity.eventType} · {activity.year}</span>
              </div>
              <p>{activity.role}</p>
            </div>
          </article>)}
        </div>
      </section>
    </div>
  </PageShell>;
}
