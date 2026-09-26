/* oxlint-disable next/no-img-element */
import { PageShell, HeroTitle } from '../../components/site';
import { activities } from '../../data/activities';

export const dynamic = 'force-static';

export default function KoreanMusicProductionPage() {
  return <PageShell locale="ko" path="/music-production">
    <HeroTitle>Music Production</HeroTitle>
    <section className="content-width activity-gallery" aria-label="음악 제작 활동">
      {activities.map((activity) => <article className="activity-card" key={activity.id}>
        <div className="activity-media">
          {activity.image ? <img src={activity.image} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <div className="activity-placeholder" aria-hidden="true">♪</div>}
        </div>
        <div className="activity-meta">
          <div className="activity-title-group">
            <h2>{activity.title}</h2>
            <span>{activity.eventType}</span>
          </div>
          <p>{activity.role}</p>
        </div>
      </article>)}
    </section>
  </PageShell>;
}
