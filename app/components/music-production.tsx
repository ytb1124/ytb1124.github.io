/* oxlint-disable next/no-img-element */
import Image from 'next/image';
import { activities } from '../data/activities';
import { musicProduction } from '../data/music-production';
import type { Locale } from '../data/site';
import { HeroTitle, PageShell, YoutubeEmbed } from './site';

const koreanEventTypes: Record<string, string> = {
  'Artist Showcase': '아티스트 쇼케이스', 'Awards Event': '시상식', 'Broadcast & Recording Production': '방송·레코딩 제작',
  'Camp & Community Program': '캠프·커뮤니티 프로그램', 'Church Event': '교회 행사', 'Church Retreat': '교회 수련회',
  'Closing Ceremony': '폐막식', 'Community Concert': '커뮤니티 공연', Concert: '콘서트', Conference: '컨퍼런스', Convention: '컨벤션',
  'Corporate & Foundation Event': '기업·재단 행사', 'Creative Industry Conference': '크리에이티브 산업 컨퍼런스', 'Drone Light Show': '드론 라이트 쇼',
  'English Speech Competition': '영어 말하기 대회', 'Fair & Exhibition': '박람회·전시', 'Fan Meeting': '팬미팅', Festival: '페스티벌',
  'Film & Community Event': '영화·커뮤니티 행사', 'Forum & Talk': '포럼·토크', 'House of Worship Audio': '예배 공간 음향',
  'Live Performance': '라이브 공연', 'Marathon & Music Festival': '마라톤·음악 축제', 'Musical Production': '뮤지컬 공연',
  'Outdoor Live Performance': '야외 라이브 공연', 'School & Community Performance': '학교·지역 공연', 'Sound System Tuning': '음향 시스템 튜닝',
  'Theater Production': '연극 공연', 'University Sports Event': '대학 스포츠 행사', 'Vehicle Launch Event': '신차 발표회', 'Worship Service': '예배',
};

const koreanRoles: Record<string, string> = {
  'Mixing Engineer': '믹싱 엔지니어', 'System Engineer': '시스템 엔지니어', Technician: '테크니션',
};

export function MusicProduction({ locale }: { locale: Locale }) {
  const ko = locale === 'ko';
  const language = ko ? 'ko' : 'en';

  return <PageShell locale={locale} path="/music-production">
    <HeroTitle locale={locale}>{ko ? '음악 제작' : 'Music Production'}</HeroTitle>
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
                {!!project.sources.length && <div className="selected-project-sources"><span>{ko ? '자료 출처' : 'Sources'}</span>{project.sources.map((source) => <a href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>{ko ? (source.label.startsWith('Byeonsa') ? '변사 음성·음원 참고' : '영상 출처') : source.label} ↗</a>)}</div>}
              </div>
              <YoutubeEmbed url={project.videoUrl} locale={locale} />
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
          <div><p>{musicProduction.studio.eyebrow[language]}</p><h2 id="studio-recording-title">{ko ? '스튜디오 레코딩' : musicProduction.studio.title}</h2></div>
        </div>
        <div className="album-feature">
          <a className="album-cover-link" href={musicProduction.studio.playlistUrl} target="_blank" rel="noopener noreferrer" data-no-lightbox aria-label={musicProduction.studio.listenLabel[language]}>
            <Image src={musicProduction.studio.cover} alt={ko ? 'Merry Night 싱글 앨범 커버' : musicProduction.studio.coverAlt} width={540} height={540} priority />
          </a>
          <div className="album-details">
            <p className="album-credit">{musicProduction.studio.credit[language]}</p>
            <h3>{musicProduction.studio.albumTitle}</h3>
            <p className="album-meta">{ko ? '재즈 · 2026 · 3곡 · 14분' : musicProduction.studio.meta}</p>
            <ol className="album-tracks">
              {musicProduction.studio.tracks.map((track,index)=><li key={`${track.title}-${index}`}><span>{String(index+1).padStart(2,'0')}</span><strong>{track.title}</strong><time>{track.duration}</time></li>)}
            </ol>
            <p className="album-note">{musicProduction.studio.note[language]}</p>
            <a className="text-link album-listen-link" href={musicProduction.studio.playlistUrl} target="_blank" rel="noopener noreferrer">{musicProduction.studio.listenLabel[language]}</a>
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
          <YoutubeEmbed playlist url={musicProduction.mixing.playlistUrl} locale={locale} />
        </div>
      </section>

      <section className="production-section live-sound-section" aria-labelledby="live-sound-title">
        <div className="production-heading">
          <span>03</span>
          <div><p>{musicProduction.credits.eyebrow[language]}</p><h2 id="live-sound-title">{ko ? '라이브 사운드' : musicProduction.credits.title}</h2></div>
        </div>
        <div className="activity-gallery" aria-label={ko ? '라이브 사운드 활동 이력' : 'Live sound credits'}>
          {activities.map((activity) => <article className="activity-card" key={activity.id}>
            <div className="activity-media">
              {activity.image ? <img src={activity.image} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <div className="activity-placeholder" aria-hidden="true">♪</div>}
            </div>
            <div className="activity-meta">
              <div className="activity-title-group">
                <h2>{ko ? activity.title : activity.englishTitle}</h2>
                <span>{ko ? (koreanEventTypes[activity.eventType] ?? activity.eventType) : activity.eventType} · {activity.year}</span>
              </div>
              <p>{ko ? (koreanRoles[activity.role] ?? activity.role) : activity.role}</p>
            </div>
          </article>)}
        </div>
      </section>
    </div>
  </PageShell>;
}
