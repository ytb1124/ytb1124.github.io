import type { Locale } from '../data/site';
import { contributions } from '../data/project-evidence';
import { projectSummaries } from '../data/project-summaries';
import { AudioToMidiEvidence } from './audio-to-midi-evidence';

const ir = [
  ['SLF', 2.27, 1.47], ['SRF', 2.67, 2.35], ['SLC', 3.30, 2.93],
  ['SRC', 3.17, 2.17], ['SLB', 2.40, 2.32], ['SRB', 2.33, 2.22],
] as const;

export function ProjectEvidence({ slug, locale }: { slug: string; locale: Locale }) {
  if (!['corrective-impulse-response', 'spatial-renderer-system-identification', 'electronic-drums', 'audio-to-midi-system'].includes(slug)) return null;
  const ko = locale === 'ko';
  return <figure className="evidence-figure">
    <div className="evidence-heading"><span>{ko ? '측정과 검증' : 'Evidence at a glance'}</span><strong>{slug === 'corrective-impulse-response' ? (ko ? '측정값과 후속 비교 계획' : 'Measured result and next comparison') : slug === 'spatial-renderer-system-identification' ? (ko ? '예측 실패 후 달라진 해석' : 'A failed prediction and a revised explanation') : slug === 'audio-to-midi-system' ? (ko ? '평가 인프라와 초기 기준선' : 'Evaluation infrastructure and initial baseline') : (ko ? '앞으로 확인할 내용' : 'Planned evaluation')}</strong></div>
    {slug === 'corrective-impulse-response' && <>
      <div className="evidence-legend"><span><i className="bar-before" />{ko?'무보정':'Uncorrected'}</span><span><i className="bar-after" />{ko?'제안 방식':'Proposed method'}</span></div>
      <p className="evidence-axis">{ko?'오차(dB) · 낮을수록 목표 응답에 가깝습니다':'Error (dB) · lower is closer to the target response'}</p><div className="evidence-bars">{ir.map(([label,before,after])=><div className="evidence-bar-row" key={label}><span>{label}</span><div><b className="bar-before" style={{width:`${before/3.5*100}%`}} title={`${before} dB`} /><b className="bar-after" style={{width:`${after/3.5*100}%`}} title={`${after} dB`} /></div><small>{before.toFixed(2)} → {after.toFixed(2)} dB</small></div>)}</div>
      <figcaption>{ko?'4열 중앙, 초기 0–40 ms·125 Hz–4 kHz의 목표 홀 대비 평균 스펙트럼 오차. 평균 2.69→2.24 dB. 필터 생성에 사용한 측정 자료의 1차 비교이며, 다른 좌석과 목표 IR 직접 컨볼루션은 후속 측정 계획입니다.':'Mean spectral error against the target hall at fourth-row center, 0–40 ms and 125 Hz–4 kHz: 2.69 → 2.24 dB. First-stage comparison on data used to derive the filters. Other seats and direct target-IR convolution are planned measurements.'} <a href={ko?'/reports/corrective-ir-paper-ko.pdf':'/reports/corrective-ir-paper-en.pdf'}>{ko?'논문 표 3 ↗':'Paper, Table 3 ↗'}</a></figcaption>
    </>}
    {slug === 'spatial-renderer-system-identification' && <>
      <div className="evidence-predictions"><div><span>{ko?'측정 전 예측 · 실패':'Prediction before measurement · failed'}</span><strong>N 9.2876 dB<br/>T 8.6677 dB</strong><small>{ko?'최대 오차':'maximum errors'}</small></div><span className="evidence-arrow">→</span><div><span>{ko?'측정 후 N을 설명한 모델':'Model fitted after measuring N'}</span><strong>0.0064 dB</strong><small>{ko?'최대 오차 · 사후 적합':'maximum residual · post-hoc fit'}</small></div></div>
      <figcaption>{ko?'같은 5스피커 시험에서 사전 Sp2–Sp3 후보는 실패했습니다. N에 대한 Sp1–Sp4 투영은 측정 후 선택한 설명이며, T까지 포괄하는 규칙은 아직 없습니다.':'The Sp2–Sp3 candidate failed on the new five-speaker N/T test. Sp1–Sp4 projection for N was selected after seeing the data; no general rule explains T.'} <a href={ko?'/reports/sound-xr-image-renderer-report-ko.pdf':'/reports/sound-xr-image-renderer-report-en.pdf'}>{ko?'결과보고서 7절 ↗':'Report, §7 ↗'}</a></figcaption>
    </>}
    {slug === 'electronic-drums' && <><div className="evidence-plan"><span>{ko?'타격 세기(MIDI 벨로시티) 기록':'Record how hard the player strikes'}</span><span>→</span><span>{ko?'기존 반응과 맞춤 반응 비교':'Compare fixed and tailored responses'}</span><span>→</span><span>{ko?'연주·청취 평가':'Playing and listening evaluation'}</span></div><figcaption>{ko?'현재는 한 연주자에 맞춰 수동으로 조절한 프로토타입입니다. 타격 세기의 분포와 조절 전후 차이는 아직 측정하지 않았습니다.':'The current prototype uses manual mapping for one player. Distribution and before/after comparison data have not been reported.'}</figcaption></>}
    {slug === 'audio-to-midi-system' && <AudioToMidiEvidence locale={locale}/>}
  </figure>;
}

export function ContributionBox({ slug, locale }: { slug: string; locale: Locale }) {
  const summary = projectSummaries[slug]?.[locale];
  if (!summary) return null;
  const tools = contributions[slug]?.tools[locale];
  return <section className="contribution-box merged-contribution" aria-label={locale==='ko'?'내 기여와 발견':'My contribution and findings'}>
    <h2>My contribution</h2>
    <dl>
      <div><dt>Wonder</dt><dd>{summary.question}</dd></div>
      <div><dt>Build</dt><dd>{summary.build}
        {tools&&<details className="contribution-tools"><summary>{locale==='ko'?'외부 도구와 AI 사용':'External tools & AI'}</summary><p>{tools}</p></details>}
      </dd></div>
      <div><dt>Find out</dt><dd>{summary.findOut}</dd></div>
    </dl>
  </section>;
}
