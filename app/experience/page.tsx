import { PageShell, HeroTitle, YoutubeEmbed } from '../components/site';
import { site } from '../data/site';
import { koreanExperience } from '../data/korean';

export const dynamic = 'force-static';

type DetailItem = {
  organization: string;
  role: string;
  period: string;
  location?: string;
  details?: readonly string[];
};

type CompactItem = {
  name: string;
  organization: string;
  period: string;
};

const experienceEn: readonly DetailItem[] = [
  {
    organization: 'Independent Research Practice',
    role: 'Researcher in Live Performance Technology',
    period: 'July 2023 – Present',
    details: [
      'Conduct practice-based research through live performance environments, using real-world productions as experimental contexts.',
      'Designed and operated sound systems for 200+ live performances as part of research into emotional consistency and audience experience.',
      'Develop experimental prototypes with Max/MSP and Python, focusing on immersive audio and real-time DSP under live-performance constraints.',
    ],
  },
  {
    organization: 'Youngkwang Church · Seongseok Church · Jamsildong Church',
    role: 'Sound Engineer — House of Worship',
    period: '2023 – Present',
    details: [
      'Operate and manage sound systems in community-based performance contexts where clarity, inclusion, and emotional delivery are critical.',
      'Observed how audience conditions affect participation and emotional reception, shaping a research interest in accessible performance technology.',
    ],
  },
  {
    organization: 'Artmix · Seoul Sound · TSA · Others',
    role: 'Live Sound Technician — Stage & System Support',
    period: 'July 2023 – Present',
    location: 'Seoul, South Korea',
    details: [
      'Support sound teams during setup, teardown, and live operation for concerts and events.',
      'Assist with stage workflows, signal routing, and on-site troubleshooting in large-scale, team-based productions.',
    ],
  },
  {
    organization: 'JPKorea · RentalOn · ODI Sound · Others',
    role: 'Freelance Live Sound Engineer / System Lead',
    period: 'July 2023 – Present',
    details: [
      'Lead system design, tuning, and live operation across more than 200 performances.',
      'Make technical decisions affecting coverage, balance, and consistency of audience experience.',
      'Coordinate with artists, stage teams, and production staff to translate artistic intent into reliable technical execution.',
    ],
  },
  {
    organization: 'Preply',
    role: 'Korean Tutor',
    period: '2023 – Present',
  },
  {
    organization: 'BLS Co., Ltd. — System Design Division',
    role: 'Technical Intern, Live Sound Systems',
    period: 'June 2025 – July 2025',
    location: 'Seoul, South Korea',
    details: [
      'Participated in the System Design division of an audio equipment distribution company.',
      'Assisted with demonstrations and technical support for the Waves Audio LV1 live sound ecosystem.',
      'Supported live sound demos and observed how commercial audio systems are evaluated and adapted for performance environments.',
    ],
  },
  {
    organization: 'Dong-ah Institute of Media and Arts',
    role: 'Academic & Technical Leadership',
    period: 'November 2023 – December 2024',
    details: [
      'Served as Head of Academic Affairs for the SR Society in 2024.',
      'Organized technical discussions and projects focused on sound systems, performance technology, and emerging audio practices.',
    ],
  },
  {
    organization: 'Ministry of National Defense, Republic of Korea',
    role: 'Live Sound Engineer — House of Worship',
    period: 'June 2023 – June 2024',
  },
  {
    organization: 'Republic of Korea Army',
    role: 'Sergeant · Blue House / Presidential Security Service',
    period: 'May 2021 – November 2022',
  },
];

const experienceKo: readonly DetailItem[] = [
  {
    organization: '독립 연구 활동',
    role: '라이브 퍼포먼스 기술 연구자',
    period: '2023년 7월 – 현재',
    details: [
      '실제 공연 제작 현장을 실험 환경으로 삼아 실천 기반 연구를 수행하고 있습니다.',
      '200회 이상의 라이브 공연에서 음향 시스템을 설계·운영하며 감정 전달의 일관성과 관객 경험을 연구했습니다.',
      'Max/MSP와 Python으로 이머시브 오디오 및 실시간 DSP 프로토타입을 개발하고 있습니다.',
    ],
  },
  {
    organization: '영광교회 · 성석교회 · 잠실동교회',
    role: '교회 음향 엔지니어',
    period: '2023년 – 현재',
    details: [
      '명료도, 포용성, 감정 전달이 중요한 공동체 공연 환경에서 음향 시스템을 운영하고 관리했습니다.',
      '관객의 서로 다른 조건이 참여와 정서적 수용에 미치는 영향을 관찰하며 접근 가능한 공연 기술에 관한 연구 관심을 발전시켰습니다.',
    ],
  },
  {
    organization: 'Artmix · Seoul Sound · TSA 외',
    role: '라이브 사운드 테크니션 — 무대·시스템 지원',
    period: '2023년 7월 – 현재',
    location: '서울, 대한민국',
    details: [
      '콘서트와 행사에서 음향 팀의 설치, 철수, 라이브 운영을 지원했습니다.',
      '대규모 제작 현장에서 무대 진행, 신호 라우팅, 현장 문제 해결을 담당했습니다.',
    ],
  },
  {
    organization: 'JPKorea · RentalOn · ODI Sound 외',
    role: '프리랜서 라이브 사운드 엔지니어 / 시스템 리드',
    period: '2023년 7월 – 현재',
    details: [
      '200회 이상의 공연에서 시스템 설계, 튜닝, 라이브 운영을 총괄했습니다.',
      '커버리지, 밸런스, 관객 경험의 일관성에 영향을 주는 기술적 결정을 담당했습니다.',
      '아티스트와 무대·제작 팀의 의도를 안정적인 기술 실행으로 연결했습니다.',
    ],
  },
  { organization: 'Preply', role: '한국어 강사', period: '2023년 – 현재' },
  {
    organization: '(주)비엘에스 — SD사업부',
    role: '라이브 사운드 시스템 기술 인턴',
    period: '2025년 6월 – 7월',
    location: '서울, 대한민국',
    details: [
      '음향 장비 유통사의 시스템 디자인 부서에서 실무를 경험했습니다.',
      'Waves Audio LV1 라이브 사운드 제품군의 시연과 기술 지원을 보조했습니다.',
      '라이브 사운드 데모를 준비·운영하며 상용 오디오 시스템이 공연 현장에 맞게 평가되고 적용되는 과정을 경험했습니다.',
    ],
  },
  {
    organization: '동아방송예술대학교',
    role: '학술·기술 리더십',
    period: '2023년 11월 – 2024년 12월',
    details: [
      '2024년 SR 학회 학술부장을 맡았습니다.',
      '음향 시스템, 공연 기술, 새로운 오디오 실무를 주제로 기술 토론과 프로젝트를 기획했습니다.',
    ],
  },
  {
    organization: '대한민국 국방부',
    role: '국군중앙교회 라이브 사운드 엔지니어',
    period: '2023년 6월 – 2024년 6월',
  },
  {
    organization: '대한민국 육군',
    role: '병장 · 청와대 / 대통령경호처',
    period: '2021년 5월 – 2022년 11월',
  },
];

function DetailGroup({ title, items }: { title: string; items: readonly DetailItem[] }) {
  return <section className="experience-section">
    <header className="experience-section-title"><h2>{title}</h2></header>
    <div className="experience-list">{items.map((item) => <article className="experience-entry" key={`${item.organization}-${item.period}`}>
      <div className="experience-entry-head">
        <div><p className="experience-organization">{item.organization}</p><h3>{item.role}</h3></div>
        <div className="experience-meta"><time>{item.period}</time>{item.location && <span>{item.location}</span>}</div>
      </div>
      {item.details && <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
    </article>)}</div>
  </section>;
}

function CompactGroup({ title, items }: { title: string; items: readonly CompactItem[] }) {
  return <section className="experience-section experience-section-compact">
    <header className="experience-section-title"><h2>{title}</h2></header>
    <div className="experience-list">{items.map((item) => <article className="experience-entry" key={`${item.name}-${item.period}`}>
      <div className="experience-entry-head">
        <div><p className="experience-organization">{item.organization}</p><h3>{item.name}</h3></div>
        <div className="experience-meta"><time>{item.period}</time></div>
      </div>
    </article>)}</div>
  </section>;
}

export default function ExperiencePage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const exp = locale === 'ko' ? { ...site.experience, ...koreanExperience } : site.experience;
  const education: readonly DetailItem[] = locale === 'ko' ? [{
    organization: '동아방송예술대학교',
    role: '음향제작과 전문학사 · 학점 4.01 / 4.5',
    period: '2020년 3월 – 2026년 2월',
  }] : [{
    organization: 'Dong-ah Institute of Media and Arts',
    role: 'Associate of Arts in Audio Production · GPA 4.01 / 4.5',
    period: 'March 2020 – February 2026',
  }];
  const toCompact = (rows: readonly (readonly [string, string, string])[]): CompactItem[] => rows.map(([name, organization, period]) => ({ name, organization, period }));
  const labels = locale === 'ko' ? {
    education: '학력', experience: '경력', scholarships: '장학', awards: '수상', certifications: '자격 및 수료', viewCv: 'CV PDF 보기 →', liveHistory: '라이브 사운드 이력 →', mixing: '믹싱 포트폴리오', live: '라이브 사운드 이력',
  } : {
    education: 'Education', experience: 'Experience', scholarships: 'Scholarships', awards: 'Awards', certifications: 'Licenses & Certifications', viewCv: 'View CV (PDF) →', liveHistory: 'Live Sound History →', mixing: 'Mixing Portfolio', live: 'Live Sound History',
  };

  return <PageShell locale={locale} path="/experience">
    <HeroTitle><span>{exp.title.split('\n').map((line) => <span key={line}>{line}</span>)}</span></HeroTitle>
    <section className={`content-width cv-intro${locale === 'ko' ? ' cv-intro-ko' : ''}`}>
      <h2>{exp.cvTitle}</h2>
      <div><p>{exp.cvDescription}</p><div className="button-row"><a className="pill-link" href={site.socials.cv} target="_blank" rel="noopener noreferrer">{labels.viewCv}</a><a className="pill-link" href={site.socials.liveHistory}>{labels.liveHistory}</a></div></div>
    </section>
    <div className="experience-records content-width">
      <DetailGroup title={labels.education} items={education} />
      <DetailGroup title={labels.experience} items={locale === 'ko' ? experienceKo : experienceEn} />
      <CompactGroup title={labels.scholarships} items={toCompact(exp.scholarships)} />
      <CompactGroup title={labels.awards} items={toCompact(exp.awards)} />
      <CompactGroup title={labels.certifications} items={toCompact(exp.licenses)} />
    </div>
    <section className="content-width stage-video experience-video"><YoutubeEmbed playlist /><div className="video-links"><h2>{labels.mixing}</h2><a className="text-link" href={site.socials.youtube}>MIXING PORTFOLIO →</a><h2>{labels.live}</h2><a className="text-link" href={site.socials.notion}>LIVE SOUND PORTFOLIO →</a></div></section>
  </PageShell>;
}
