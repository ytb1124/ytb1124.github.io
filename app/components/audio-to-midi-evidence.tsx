import baseline from '../../content/audio-to-midi-evaluation.json';
import type { Locale } from '../data/site';

const paths = ['A', 'B', 'C'] as const;
const groups = [baseline.headline_f1.synth_clean, baseline.loso.headline_f1];

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
      <caption>{ko ? '같은 7곡·반주 재분리 조건 · 학습곡 포함 기준선과 LOSO 비교' : 'Same 7 songs and re-cleaned beds · training-song baseline versus LOSO'}</caption>
      <thead><tr><th scope="col">{ko ? '입력 경로' : 'Input path'}</th><th scope="col">{ko ? '학습 포함' : 'In-sample'}</th><th scope="col">LOSO</th></tr></thead>
      <tbody>{paths.map((path, index) => <tr key={path}>
        <th scope="row">{path} · {labels[index]}</th>
        {groups.map((group, groupIndex) => {
          const songs = Object.values(group);
          const mean = songs.reduce((sum, song) => sum + song[path], 0) / songs.length;
          return <td key={groupIndex}>{mean.toFixed(3)}</td>;
        })}
      </tr>)}</tbody>
    </table>
    <figcaption>{ko
      ? '시작 시점 허용오차 50 ms. LOSO는 각 평가곡을 제외한 6곡으로 분류기를 학습한 7폴드 결과입니다. 분리 후 F1은 곡별 0.578~0.921로 차이가 큽니다. 소규모 합성 데이터의 결과이며, 실제 제작 음원의 성능과 작업 시간 절감은 추가 검증이 필요합니다.'
      : '50 ms onset tolerance. Each of the 7 LOSO folds trains the classifier on the other 6 songs. Separated-stem F1 varies from 0.578 to 0.921 across songs. These results cover a small synthetic dataset; real production recordings and workflow time savings need further evaluation.'} <a href={baseline.loso.source}>{ko ? 'LOSO 결과 원본 ↗' : 'Recorded LOSO results ↗'}</a>
    <details className="midi-evaluation-details">
      <summary>{ko ? 'LOSO 곡별 F1과 평가 설정' : 'Per-song LOSO F1 and evaluation setup'}</summary>
      <table className="midi-baseline-table">
        <caption>{ko ? '곡별 클래스·시작 시점 일치 F1' : 'Per-song class-aware onset F1'}</caption>
        <thead><tr><th scope="col">{ko ? '평가곡' : 'Held-out song'}</th><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th></tr></thead>
        <tbody>{Object.entries(baseline.loso.headline_f1).map(([name, song]) => <tr key={name}>
          <th scope="row">{name.replace('drums_', '').replace('_synth', '')}</th>
          {paths.map(path => <td key={path}>{song[path].toFixed(3)}</td>)}
        </tr>)}</tbody>
      </table>
      <p>{ko ? 'A: 믹스, B: Demucs 분리 스템, C: 정답 스템. C는 전사 병목을 확인하는 참조 경로이며 모든 곡에서 최고 점수를 보장하지 않습니다. 반주를 한 번 더 분리해 잔여 드럼을 줄인 합성 믹스를 사용했습니다.' : 'A: mixture, B: Demucs stem, C: reference stem. C is a reference for transcription errors and does not guarantee the highest score on every song. The synthetic mixes use accompaniment separated again to reduce residual drums.'}</p>
      <a href={baseline.loso.manifest}>{ko ? '곡별 제외 모델·입력 설정 ↗' : 'Fold models and input configuration ↗'}</a>
    </details>
    <details className="midi-evaluation-details">
      <summary>{ko ? '평가 인프라와 재현성 기록' : 'Evaluation infrastructure and reproducibility'}</summary>
      <ul>
        <li>{ko ? '베이스 6곡·드럼 8곡의 WAV·정답 MIDI 쌍. 이 중 합성 기준선은 드럼 7곡입니다.' : '6 bass and 8 drum WAV/reference-MIDI pairs; the synthetic baseline uses 7 of the drum songs.'}</li>
        <li>{ko ? '베이스: mir_eval precision·recall·F1(50 ms·50 cent, 종료 시점 일치 제외), 옥타브·타이밍·음 길이 별도 진단. 드럼: 악기 클래스별 onset F1.' : 'Bass: mir_eval precision/recall/F1 (50 ms, 50 cents, no offset matching), plus octave, timing, and duration diagnostics. Drums: class-aware onset F1.'}</li>
        <li>{ko ? '합성 믹스 생성, 7폴드 LOSO 모델·평가 결과, 옥타브·분절 음표 분류기 학습 스크립트 구축.' : 'Built synthetic-mix generation, seven-fold LOSO models and recorded evaluations, and octave/fragment classifier training scripts.'}</li>
        <li>{ko ? '기록된 실행 환경' : 'Recorded environment'}: {baseline.environment.demucs_model}, {baseline.environment.device}, {baseline.environment.sr.toLocaleString('en-US')} Hz, bed gain {baseline.environment.bed_gain}. {ko ? '기준선 원본에 산출물 해시와 결정성 가정을 기록했습니다.' : 'The baseline source records artifact hashes and determinism assumptions.'}</li>
      </ul>
      <a href={baseline.source}>{ko ? '학습곡 포함 기준선·재현성 기록 ↗' : 'In-sample baseline and reproducibility notes ↗'}</a>
    </details>
    </figcaption>
  </>;
}
