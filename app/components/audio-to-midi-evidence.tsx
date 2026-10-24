import baseline from '../../content/audio-to-midi-evaluation.json';
import type { Locale } from '../data/site';

const paths = ['A', 'B', 'C'] as const;
const groups = ['synth', 'synth_clean'] as const;

export function AudioToMidiEvidence({ locale }: { locale: Locale }) {
  const ko = locale === 'ko';
  const labels = ko
    ? ['믹스 → 전사', 'Demucs 분리 → 전사', '정답 스템 → 전사']
    : ['Mixture → transcription', 'Demucs stem → transcription', 'Reference stem → transcription'];

  return <>
    <p className="evidence-axis">{ko
      ? '합성 드럼 7곡 · 클래스별 onset micro F1의 곡 평균 · 높을수록 좋음'
      : '7 synthetic drum mixtures · mean of per-song class-aware onset micro F1 · higher is better'}</p>
    <table className="midi-baseline-table">
      <caption>{ko ? '저장된 초기 비교 기준선 · 학습에 사용한 곡' : 'Recorded initial baseline · evaluated on training songs'}</caption>
      <thead><tr><th scope="col">{ko ? '입력 경로' : 'Input path'}</th><th scope="col">{ko ? '합성 믹스' : 'Synthetic mix'}</th><th scope="col">{ko ? '반주 재분리' : 'Re-cleaned bed'}</th></tr></thead>
      <tbody>{paths.map((path, index) => <tr key={path}>
        <th scope="row">{path} · {labels[index]}</th>
        {groups.map(group => {
          const songs = Object.values(baseline.headline_f1[group]);
          const mean = songs.reduce((sum, song) => sum + song[path], 0) / songs.length;
          return <td key={group}>{mean.toFixed(3)}</td>;
        })}
      </tr>)}</tbody>
    </table>
    <figcaption>{ko
      ? '시작 시점 허용오차 50 ms. 반주 재분리는 잔여 드럼을 줄이기 위해 반주를 한 번 더 분리한 조건입니다. 같은 곡에서 학습한 분류기를 사용한 합성 믹스 비교이며, 새로운 녹음의 성능이나 실제 작업 시간 절감을 뜻하지 않습니다.'
      : '50 ms onset tolerance. The re-cleaned bed condition separates the accompaniment again to reduce residual drums. These synthetic comparisons use a classifier trained on the evaluated songs; they do not establish performance on unfamiliar recordings or time savings.'} <a href={baseline.source}>{ko ? '기준선 원본 ↗' : 'Baseline source ↗'}</a>
    <details className="midi-evaluation-details">
      <summary>{ko ? '평가 인프라와 재현성 기록' : 'Evaluation infrastructure and reproducibility'}</summary>
      <ul>
        <li>{ko ? '베이스 6곡·드럼 8곡의 WAV·정답 MIDI 쌍. 이 중 합성 기준선은 드럼 7곡입니다.' : '6 bass and 8 drum WAV/reference-MIDI pairs; the synthetic baseline uses 7 of the drum songs.'}</li>
        <li>{ko ? '베이스: mir_eval precision·recall·F1(50 ms·50 cent, 종료 시점 일치 제외), 옥타브·타이밍·음 길이 별도 진단. 드럼: 악기 클래스별 onset F1.' : 'Bass: mir_eval precision/recall/F1 (50 ms, 50 cents, no offset matching), plus octave, timing, and duration diagnostics. Drums: class-aware onset F1.'}</li>
        <li>{ko ? '합성 믹스 생성, LOSO 평가 설정과 모델, 옥타브·분절 음표 분류기 학습 스크립트 구현.' : 'Implemented synthetic-mix generation, LOSO evaluation configurations and models, and octave/fragment classifier training scripts.'}</li>
        <li>{ko ? '기록된 실행 환경' : 'Recorded environment'}: {baseline.environment.demucs_model}, {baseline.environment.device}, {baseline.environment.sr.toLocaleString('en-US')} Hz, bed gain {baseline.environment.bed_gain}. {ko ? '기준선 원본에 산출물 해시와 결정성 가정을 기록했습니다.' : 'The baseline source records artifact hashes and determinism assumptions.'}</li>
      </ul>
      <a href="https://github.com/ytb1124/audio-to-midi/blob/main/eval/separation_manifest_synth_loso.json">{ko ? '학습곡을 제외하는 LOSO 설정 ↗' : 'LOSO configuration excluding each evaluation song from training ↗'}</a>
    </details>
    </figcaption>
  </>;
}
