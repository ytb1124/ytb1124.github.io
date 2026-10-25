import baseline from '../../content/audio-to-midi-evaluation.json';
import type { Locale } from '../data/site';

const report = 'https://github.com/ytb1124/audio-to-midi/blob/main/eval/BEST_RESULTS.md';
const results = 'https://github.com/ytb1124/audio-to-midi/blob/main/eval/adtof_finetune/';

export function AudioToMidiEvidence({ locale }: { locale: Locale }) {
  const ko = locale === 'ko';
  return <>
    <p className="evidence-axis">{ko
      ? 'ADTOF · HT-Demucs 분리 스템 · 5클래스 onset F1 · 곡별 평균 · 허용오차 50 ms'
      : 'ADTOF · HT-Demucs stems · 5-class onset F1 · per-song mean · 50 ms tolerance'}</p>
    <table className="midi-baseline-table">
      <caption>{ko ? '렌더링 검증의 개선이 실제 녹음으로 이어지는가?' : 'Does a rendered-validation gain transfer to real recordings?'}</caption>
      <thead><tr><th scope="col">{ko ? '평가 조건' : 'Evaluation'}</th><th scope="col">{ko ? '기존 A0' : 'Pretrained A0'}</th><th scope="col">{ko ? '동결 A4f' : 'Frozen A4f'}</th></tr></thead>
      <tbody>
        <tr><th scope="row">{ko ? 'Slakh 검증 · 16곡' : 'Slakh validation · 16 songs'}</th><td>0.695</td><td>0.786</td></tr>
        <tr><th scope="row">{ko ? 'MDB 실제 녹음 · 23곡' : 'MDB real recordings · 23 songs'}</th><td>0.859</td><td>0.816</td></tr>
      </tbody>
    </table>
    <figcaption>
      <p><strong>{ko ? '판정: 파인튜닝 기각, 기존 모델 유지.' : 'Decision: reject fine-tuning; retain pretrained weights.'}</strong>{' '}{ko
        ? 'MDB의 곡별 대응 F1 차이는 −0.043, 95% 부트스트랩 신뢰구간은 [−0.066, −0.022]입니다. 검증셋에서 선택된 A4f는 합성곱·배치정규화 블록을 동결한 조건입니다.'
        : 'The paired per-song MDB F1 difference is −0.043, with a 95% bootstrap interval of [−0.066, −0.022]. A4f, selected on validation F1, freezes the convolutional and batch-normalization block.'}</p>
      <p>{ko
        ? 'Slakh train 40곡으로 학습하고 별도 16곡으로 검증했습니다. 실제 녹음 되새김 학습은 데이터 접근 제약으로 실행하지 못했습니다. 이 결과는 도메인 차이·망각 가설과 일치하지만 원인을 입증하지는 않습니다.'
        : 'Training used 40 Slakh train songs, with 16 separate validation songs. Real-recording rehearsal was not run because of data-access constraints. The reversal is consistent with domain shift or forgetting, but does not establish either cause.'}</p>
      <p><a href={report}>{ko ? '실험 보고서 ↗' : 'Experiment report ↗'}</a>{' · '}<a href={`${results}results_val.json`}>{ko ? '검증 원본 ↗' : 'Validation data ↗'}</a>{' · '}<a href={`${results}results_mdb.json`}>{ko ? '실제 녹음 원본 ↗' : 'Real-recording data ↗'}</a></p>
      <details className="midi-evaluation-details">
        <summary>{ko ? '비교 조건과 클래스별 변화' : 'Comparison conditions and class-level changes'}</summary>
        <p>{ko
          ? '전체 파인튜닝 A1: Slakh 0.760, MDB 0.816. A1의 MDB 평가는 단일 후보 선택 규칙 밖의 참고 실행입니다. A4f의 MDB 클래스별 F1은 킥 0.902 → 0.932, 심벌 0.680 → 0.723, 하이햇 0.810 → 0.747, 톰 0.586 → 0.528입니다.'
          : 'Full fine-tuning A1: Slakh 0.760, MDB 0.816. The A1 MDB evaluation was an additional reference run outside the single-candidate selection rule. A4f MDB class F1: kick 0.902 → 0.932, cymbal 0.680 → 0.723, hi-hat 0.810 → 0.747, tom 0.586 → 0.528.'}</p>
        <a href={`${results}finetune.py`}>{ko ? '학습 설정·동결 구현 ↗' : 'Training settings and freezing implementation ↗'}</a>
      </details>
      <details className="midi-evaluation-details">
        <summary>{ko ? '초기 실험: 합성 드럼 7곡 LOSO' : 'Earlier experiment: seven-song synthetic LOSO'}</summary>
        <p>{ko
          ? '이전 분류기를 각 평가곡을 제외한 6곡으로 학습한 7폴드 평가입니다. 평균 F1은 믹스 0.384, Demucs 분리 후 0.752, 정답 스템 0.763입니다. 현재 ADTOF 실험과 모델·데이터가 달라 직접적인 성능 개선 비교에는 사용할 수 없습니다.'
          : 'Seven folds trained the earlier classifier on six songs, excluding each evaluation song. Mean F1: mixture 0.384, Demucs stem 0.752, reference stem 0.763. The model and dataset differ from the current ADTOF experiment, so these scores are not a direct before/after comparison.'}</p>
        <a href={baseline.loso.source}>{ko ? 'LOSO 결과 원본 ↗' : 'Recorded LOSO results ↗'}</a>{' · '}<a href={baseline.loso.manifest}>{ko ? '평가 설정 ↗' : 'Evaluation configuration ↗'}</a>
      </details>
    </figcaption>
  </>;
}
