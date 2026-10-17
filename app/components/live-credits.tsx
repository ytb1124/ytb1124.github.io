/* oxlint-disable next/no-img-element */
import { activities } from '../data/activities';
import type { Locale } from '../data/site';

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
  'Mixing Engineer': '믹싱 엔지니어',
  'System Engineer': '시스템 엔지니어',
  Technician: '음향 스태프',
  '애매함!': '참여',
};

export function LiveCredits({locale}:{locale:Locale}) {
  const ko = locale === 'ko';
  return <div className="activity-gallery credits-gallery" aria-label={ko ? '공연 참여 기록' : 'Live sound credits'}>
    {activities.map(item => <article className="activity-card" key={item.id}>
      <div className="activity-media">{item.image ? <img src={item.image} alt="" width={600} height={450} loading="lazy"/> : <div className="activity-placeholder" aria-hidden="true">♪</div>}</div>
      <div className="activity-meta">
        <div className="activity-title-group">
          <h3>{ko ? item.title : item.englishTitle}</h3>
          <span>{ko ? koreanEventTypes[item.eventType] ?? item.eventType : item.eventType} · {item.year}</span>
        </div>
        <p>{ko ? koreanRoles[item.role] : item.role === '애매함!' ? 'Crew' : item.role}</p>
      </div>
    </article>)}
  </div>;
}
