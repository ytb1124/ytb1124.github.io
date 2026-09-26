/* oxlint-disable next/no-img-element */
import Image from 'next/image';
import { activities } from '../data/activities';
import type { Locale } from '../data/site';
import { HeroTitle, PageShell, YoutubeEmbed } from './site';

const tracks = [
  ['Merry Night', '2:56'],
  ['Cinnamon Stick', '5:59'],
  ["I Don’t Drink Alcohol Anymore", '5:19'],
] as const;

export function MusicProduction({ locale }: { locale: Locale }) {
  const ko = locale === 'ko';

  return <PageShell locale={locale} path="/music-production">
    <HeroTitle>Music Production</HeroTitle>
    <div className="production-showcase">
      <section className="production-section recording-section" aria-labelledby="studio-recording-title">
        <div className="production-heading">
          <span>01</span>
          <div><p>{ko ? '스튜디오 레코딩' : 'Studio Recording'}</p><h2 id="studio-recording-title">Merry Night — Single</h2></div>
        </div>
        <div className="album-feature">
          <Image src="/images/music-production/merry-night-cover.png" alt="Merry Night single cover" width={540} height={540} priority />
          <div className="album-details">
            <p className="album-credit">{ko ? 'STUDIO RECORDING · 유태빈 @ 게누인 스튜디오' : 'STUDIO RECORDING · TAEBIN YOO @ GENUIN STUDIO'}</p>
            <h3>Merry Night</h3>
            <p className="album-meta">Jazz · 2026 · 3 tracks · 14 minutes</p>
            <ol className="album-tracks">
              {tracks.map(([title,duration],index)=><li key={title}><span>{String(index+1).padStart(2,'0')}</span><strong>{title}</strong><time>{duration}</time></li>)}
            </ol>
            <p className="album-note">{ko ? 'Merry Night의 세 곡을 게누인 스튜디오에서 레코딩했습니다.' : 'Recorded all three tracks for Merry Night at Genuin Studio.'}</p>
          </div>
        </div>
      </section>

      <section className="production-section mixing-section" aria-labelledby="mixing-portfolio-title">
        <div className="production-heading">
          <span>02</span>
          <div><p>{ko ? '믹싱 포트폴리오' : 'Mixing Portfolio'}</p><h2 id="mixing-portfolio-title">{ko ? '공연 믹싱 작업' : 'From the Stage'}</h2></div>
        </div>
        <div className="mixing-feature">
          <div className="mixing-copy"><p>{ko ? '라이브 공연에서 믹싱한 작업을 모은 YouTube 플레이리스트입니다.' : 'A YouTube playlist of performances mixed across live stages and production environments.'}</p><a className="text-link" href="https://youtube.com/playlist?list=PL_kWYUD-HpqlcTCfJSD_4k87kQdzyD4DZ&si=kXkmH_rhqa1GwQVR" target="_blank" rel="noopener noreferrer">{ko ? 'YOUTUBE에서 플레이리스트 열기 →' : 'OPEN PLAYLIST ON YOUTUBE →'}</a></div>
          <YoutubeEmbed playlist />
        </div>
      </section>

      <section className="production-section live-sound-section" aria-labelledby="live-sound-title">
        <div className="production-heading">
          <span>03</span>
          <div><p>{ko ? '활동 이력' : 'Selected Credits'}</p><h2 id="live-sound-title">Live Sound</h2></div>
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
