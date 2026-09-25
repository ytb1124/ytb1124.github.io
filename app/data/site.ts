export type Locale = 'en' | 'ko';

export type Project = {
  slug: string;
  year: string;
  category: string;
  title: string;
  description: string;
  question: string;
  image: string;
  ongoing?: boolean;
};

export const site = {
  name: 'Taebin Yoo',
  koreanName: '유태빈 (兪太彬)',
  socials: {
    instagram: 'https://www.instagram.com/brightlight_more',
    linkedin: 'https://www.linkedin.com/in/taebin-yoo-414177389',
    youtube: 'https://youtube.com/playlist?list=PL_kWYUD-HpqlcTCfJSD_4k87kQdzyD4DZ&si=rZomAf1jsF4kKa-S',
    notion: 'https://taebin.notion.site/Sound-Engineer-d69375f94f3046f0af2f05915d25d561?source=copy_link',
    liveHistory:
      'https://app.notion.com/p/taebin/Live-Sound-Engineer-d69375f94f3046f0af2f05915d25d561?source=copy_link',
    cv: 'https://drive.google.com/file/d/1JpBYEs7ErJPhtol45iAvdREp-vMhIqEz/view?usp=share_link',
  },
  nav: [
    { key: 'profile', label: 'Profile', number: '02' },
    { key: 'experience', label: 'Experience', number: '03' },
    { key: 'projects', label: 'Projects', number: '01' },
    { key: 'contact', label: 'Contact', number: '04' },
  ],
  home: {
    hero: 'Why was I born?\nWho am I?\nWhat will I have to do?',
    intro:
      'I work at the intersection of live sound, music technology, and human experience. My practice explores how technology can change the ways we create, experience, and participate in music. Starting from live sound engineering, I have gradually moved toward immersive audio, interactive systems, and accessible music technology — always asking how technology can respond to the people who use it.',
    role: 'Sound Engineer & Emerging Researcher',
    disciplines: 'Immersive Audio · Music Technology',
    quote: "That's why I was born.\nTo experience whatever I can imagine—",
    quoteEnd: 'slowly, but steadily.',
  },
  koreanHome: {
    intro:
      '안녕하세요! 저는 인간의 감정과 상호 공감이 공연 음향 기술을 통해 어떻게 전해지는지를 탐구하는 유태빈입니다. 라이브 사운드 엔지니어 배경으로 200개 이상의 라이브 이벤트에서 디자인하고 운영한 현장 경험으로 관객을 이해합니다. 저는 동일한 관객의 입장에서 아티스트와 엔지니어의 예술적 및 기술적 의도가 모든 관객에게 최대한 동등하게 인식될 수 있는 방법을 고민합니다. 현재 저의 작업은 이머시브 오디오와 Max/MSP의 실시간 처리를 연구 도구로 사용하여 공연 시스템에서 영향을 프로토타입하고 테스트합니다.',
    role: 'Sound Engineer & Emerging Researcher',
    disciplines: 'Immersive / Spatial Audio · Music Technology',
    quote: '그래서 제가 태어난 것만 같아요.\n제가 상상할 수 있는 모든 것을 경험하기 위해서요.',
    quoteEnd: '천천히, 그러나 꾸준히요!',
  },
  profile: {
    title: 'Background',
    paragraphs: [
      'My mother is a classical music composer, and my father is a mathematics teacher, so I grew up surrounded by both music and logic. Even before I was born, my mother played piano as a church accompanist throughout her pregnancy, and I naturally became close to music from the very beginning.',
      'As a child, I performed with the CTS Children’s Choir under Maestro Hakwon Yoon, appearing at major venues such as Goyang Aram Nuri Arts Center and the Seoul Arts Center. During my teenage years, I continued making music through school, church, and small bands with friends.',
      'Today, I work as a freelance live sound engineer, supporting performances across a wide range of stages and environments.',
      'Growing up in a church community, my early life was shaped by faith—and it naturally led my attention toward both music and people. I’m constantly studying who I am, and thinking about how we can live alongside one another with care and respect.',
      'Outside of sound and research, I’m currently attending Professor Chulhyun Bae’s self-healing writing masterclass at The Chora, where I explore reflection and language as tools for understanding and recovery.',
    ],
    education:
      'At my father’s recommendation—he has worked in education—I chose not to attend high school after finishing middle school. Instead, I earned my high school equivalency certificate and, at 16 years old, entered the Department of Audio Production at DIMA as the top-ranked applicant in the early admissions track. During the COVID-19 period, I explored a wide range of experiences, including running an online shopping business, and later completed my mandatory military service. After being discharged, I spent two months in Vancouver and took a cross-continental train journey from Vancouver to New York. That experience continues to shape how I see people and culture, and today I also work as a Korean language tutor on Preply.',
  },
  experience: {
    title: 'Enjoying and appreciating my life—\nnow, onto my career.',
    cvTitle: 'CV & Experience',
    cvDescription: 'Download my CV or explore my live sound history.',
    entries: [
      ['Live Sound Engineer', 'Freelance', '2022 ~ Current'],
      ['Audio Engineer – House of Worship', 'Youngkwang Church, Seongseok Church, Jamsildong Church, Ministry of National Defense, Republic of Korea', '2023 ~ Current'],
      ['Korean Tutor', 'Preply', '2023 ~ Current'],
      ['Technical Intern, Live Sound Systems', 'BLS Co., Ltd. – System Design Division (SD)', '2025'],
      ['Academic & Technical Leadership', 'DIMA SR Team', '2023 ~ 2024'],
    ],
    licenses: [
      ['National Technical Qualification for Theatrical Arts (Audio)', 'Ministry of Culture, Sports and Tourism', '2023'],
      ['Q-SYS Architect & Level Zero', 'QSC', '2026'],
      ['House of worship audio training', 'QSC', '2026'],
      ['Smaart Operation Level 1', 'Rational Acoustics', '2025'],
      ['Dante Certification Level 1 & 2', 'Audinate', '2023'],
    ],
    education: [
      ['Dong-ah Institute of Media and Arts', 'Associate of Arts - AA, Audio Production (Grade 4.01/4.5)', '2020 ~ 2026'],
      ['Dong-ah Institute of Media and Arts', 'Academic Excellence Scholarship', '2020 ~ 2026'],
      ['SAMA SOUND', 'Jeong-do Scholarship (Top Award / 1st Place)', '2025'],
      ['SAMA SOUND', 'Mi-rae Scholarship (2nd Place)', '2024'],
    ],
    awards: [['Recipient, Outstanding Paper Presentation Award', 'The 5th Electroacoustics & Stage Sound Conference, The Acoustical Society of Korea', '2026']],
  },
  contact: {
    title: 'Contact',
    phone: '+82 10 4061 5183',
    phoneHref: 'tel:+821040615183',
    address: 'Seoul, Korea',
    email: 'ytb1124@naver.com',
    emailHref: 'mailto:ytb1124@naver.com',
    kakao: 'ytb1124',
  },
  sections: [
    {
      number: '01.',
      title: 'Immersive Experience',
      koreanTitle: '이머시브 경험',
      question: 'How can technology transform the way we experience sound and space?',
      koreanQuestion: '음악이 존재하는 공간은 어떻게 확장될 수 있을까?',
      projects: [
        {
          slug: 'corrective-impulse-response', year: '2025', category: 'Acoustics system', title: 'Corrective IR Spatial Reconstruction', description: 'Exploring acoustic space reproduction through impulse response measurement, corrective FIR generation, and real-time convolution processing.', question: 'How can we recreate the acoustic identity of a space beyond its physical boundaries?', image: '/images/ir.png',
        },
        {
          slug: 'live-immersive-audio', year: '2025', category: 'Performance', title: 'Yamaha AFC Image', description: 'Investigating how immersive audio systems influence live performance experiences from multiple perspectives.', question: 'How does immersive audio reshape the relationship between performers, creators, and audiences?', image: '/images/afc.jpg',
        },
        {
          slug: 'multichannel-mixing-system', year: '2025', category: 'Audio', title: 'Multichannel Spatial Mixing System', description: 'Exploring immersive sound image control and spatial mixing approaches for small performance venues.', question: 'How can spatial audio connect what audiences see with what they hear in a performance space?', image: '/images/multichannel.png',
        },
        {
          slug: 'wan-audio-transmission', year: '2025', category: 'Technology', title: 'WAN Audio Transmission System', description: 'Exploring real-time networked audio systems for remote musical interaction and collaboration.', question: 'How can musical collaboration continue when physical distance becomes a limitation?', image: '/images/wan.png',
        },
      ] satisfies Project[],
    },
    {
      number: '02.', title: 'Musical Expression', koreanTitle: 'Musical Expression', question: 'How can technology understand and expand human musical expression?', koreanQuestion: '기술은 인간의 음악적 표현을 어떻게 이해하고 확장할 수 있을까?', projects: [
        { slug: 'electronic-drums', year: '2025', category: 'Instrument', title: 'Interactive Electronic Drum', description: 'Exploring performer-specific instrument behavior and adaptive sound generation to preserve individual playing styles.', question: 'How can electronic instruments capture the unique dynamics and expression of individual performers?', image: '/images/drum.png' },
        { slug: 'audio-to-midi-system', year: '2026', category: 'Technology', title: 'Audio-to-MIDI System (Ongoing Research)', description: 'Exploring an AI-assisted music creation workflow that transforms audio-based musical ideas into editable digital structures, helping musicians create and modify digital music more intuitively.', question: 'How can musicians move naturally between human expression and digital composition?', image: '/images/midi.png', ongoing: true },
        { slug: 'arirang', year: '2026', category: 'Audio', title: 'Arirang 1926: Sonic Restoration Project', description: 'Exploring the restoration and reinterpretation of historical recordings through AI-based audio restoration and immersive audio production, transforming archival music into a new contemporary listening experience.', question: 'How can historical music be reinterpreted through contemporary technology?', image: '/images/arirang.png' },
      ] satisfies Project[],
    },
    {
      number: '03.', title: 'Musical Participation', koreanTitle: 'Musical Participation', question: 'How can music technology support different ways of experiencing music?', koreanQuestion: '음악 기술은 음악을 경험하는 서로 다른 방식을 어떻게 지원할 수 있을까?', projects: [
        { slug: 'adaptive-monitor-system', year: '2026', category: 'Performance', title: 'Adaptive Monitor System for Deaf and Hard-of-Hearing Musicians (Ongoing Research)', description: 'Exploring adaptive monitoring systems based on how Deaf and hard-of-hearing musicians perceive, perform, and interact with music.', question: 'What happens when musical systems are designed around different ways of hearing?', image: '/images/adaptive.jpeg', ongoing: true },
        { slug: 'ai-audio-engineering-copilot', year: '2026', category: 'Technology', title: 'AI Audio Engineering Copilot (Research in Development)', description: 'AI-assisted tools and workflow systems that support sound engineers while preserving human expertise.', question: 'How can engineering tools support human decisions without replacing expertise?', image: '/images/midi.png' },
      ] satisfies Project[],
    },
  ],
} as const;

export const allProjects = site.sections.flatMap((section) => section.projects);

export function isKoreanPath(pathname: string) {
  return pathname === '/ko' || pathname.startsWith('/ko/');
}

export function localizedPath(locale: Locale, path: string) {
  return locale === 'ko' ? `/ko${path === '/' ? '/' : path}` : path;
}
