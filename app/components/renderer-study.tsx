import { localizedPath, type Locale, type ProjectResource } from '../data/site';

const copy = {
  en: {
    intro: 'Live immersive audio processors place a sound between speakers by changing the signals sent to each one. I measured Sound xR Image and L-ISA to understand what their position and width controls actually do, then tested whether mathematical models could predict the outputs in new speaker layouts.',
    studies: [
      {
        name: 'Sound xR Image',
        title: 'How is the sound shared across speakers?',
        method: 'I changed sound position, speaker layout, and renderer settings on a Yamaha DME7, and measured each output level with Smaart.',
        finding: 'A model based on distance explained selected measurements well. Changing the layout and speaker IDs exposed behavior the model could not yet predict.',
      },
      {
        name: 'L-ISA',
        title: 'What changes when a sound gets wider?',
        method: 'I used digital loopback sweeps to measure output levels, frequency responses, and delays while changing position, distance, height, and width.',
        finding: 'The measurements showed how sound is shared between neighboring speaker directions, with different processing across frequencies. Widening a sound also introduced a short delayed component; its full distribution remains unresolved.',
      },
    ],
    comparisonTitle: 'What the two studies revealed',
    comparison: 'In the tested conditions, Sound xR output levels followed a distance-based model, while L-ISA shared sound between neighboring speaker directions. L-ISA also changed the balance of frequencies and introduced a short delayed component when widening a sound. Understanding those controls required looking beyond a single output-level reading.',
    methodTitle: 'How I checked the explanations',
    method: 'I compared competing models and recorded predictions before testing new conditions. When a prediction failed, I changed one factor at a time to investigate why. The reports distinguish models fitted after measurement from predictions tested on new conditions.',
    detailsTitle: 'Measurement details and limits',
    details: [
      'Sound xR: a distance-based model matched selected normal-output measurements within about 0.005 dB. Two new five-speaker tests had maximum prediction errors of 9.29 and 8.67 dB. A later fit explained one test, but did not establish a general rule.',
      'L-ISA Controller 3.2.2 / Processor Desktop 3.2.2, 48 kHz: the model predicted selected new layouts and random settings with Width = 0 within 0.03 dB, measured in a one-third-octave band around 1 kHz.',
      'An initial L-ISA height prediction failed by up to 54.4 dB. Follow-up tests supported a speaker-UUID-dependent triangulation rule in the tested layouts. One mirrored-layout exception and larger coplanar faces remain unresolved.',
      'L-ISA width was only partly identified. Delay behavior applies to the tested Desktop configuration. These electrical measurements do not establish listening quality or performance across audience seats.',
      'Sound xR was studied mainly through static output levels. Its frequency and delay behavior was not independently remeasured for this comparison, so the study cannot establish that these forms of processing are absent.',
    ],
    reportsTitle: 'Reports & data',
    reportsNote: 'Methods, equations, prediction results, and unresolved questions. The L-ISA report is currently available in Korean.',
    nextTitle: 'Next questions',
    next: 'How does L-ISA distribute a wide sound in less regular speaker layouts? How do both systems respond while a sound is moving?',
  },
  ko: {
    intro: '라이브 이머시브 오디오 프로세서는 각 스피커에 보내는 신호를 조절해 스피커 사이에 소리를 배치합니다. Sound xR Image와 L-ISA의 위치·폭 조절이 실제 출력에 어떤 변화를 만드는지 측정하고, 수학적 모델이 새로운 스피커 배치에서도 출력을 예측할 수 있는지 시험했습니다.',
    studies: [
      {
        name: 'Sound xR Image',
        title: '여러 스피커에 소리를 어떻게 나눌까?',
        method: 'Yamaha DME7에서 소리의 위치, 스피커 배치, 렌더러 설정을 바꾸고 Smaart로 각 출력의 레벨을 측정했습니다.',
        finding: '거리 기반 모델이 일부 조건의 측정값을 잘 설명했습니다. 하지만 배치와 스피커 ID를 바꾸자 모델이 예측하지 못하는 동작이 나타났습니다.',
      },
      {
        name: 'L-ISA',
        title: '소리의 폭을 넓히면 무엇이 달라질까?',
        method: '디지털 루프백 스윕으로 위치·거리·높이·폭을 바꾸며 출력 레벨, 주파수 응답, 지연을 측정했습니다.',
        finding: '이웃한 스피커 방향 사이에 소리를 나누는 규칙과 주파수에 따른 처리를 확인했습니다. 폭을 넓히면 짧은 지연 성분도 더해졌으며, 전체 분배 규칙은 아직 풀지 못했습니다.',
      },
    ],
    comparisonTitle: '두 연구에서 알게 된 점',
    comparison: '시험한 조건에서 Sound xR의 출력 레벨은 거리 기반 모델을 따랐고, L-ISA는 이웃한 스피커의 방향 사이에 소리를 나눴습니다. L-ISA는 주파수별 소리 크기도 바꾸고, 폭을 넓힐 때 짧은 지연 성분을 더했습니다. 이런 조절 기능을 이해하려면 출력 레벨 하나만 보는 것보다 주파수와 시간 변화까지 살펴봐야 했습니다.',
    methodTitle: '설명이 맞는지 확인한 방법',
    method: '여러 후보 모델을 비교하고, 새로운 조건을 측정하기 전에 예측값을 기록했습니다. 예측이 실패하면 조건을 하나씩 바꾸며 원인을 좁혔습니다. 보고서에는 측정 뒤 맞춘 모델과 새로운 조건에서 검증한 예측을 구분해 기록했습니다.',
    detailsTitle: '측정 수치와 검증 범위 자세히 보기',
    details: [
      'Sound xR: 정상 출력 조건의 일부 측정값은 거리 기반 모델과 약 0.005 dB 이내로 맞았습니다. 새로운 5스피커 시험 두 조건에서는 최대 예측 오차가 9.29 dB와 8.67 dB였습니다. 이후 한 조건에 맞춘 설명으로도 일반적인 규칙은 확정하지 못했습니다.',
      'L-ISA Controller 3.2.2 / Processor Desktop 3.2.2, 48 kHz: Width = 0의 일부 새 배치와 무작위 설정에서, 1 kHz 중심 1/3옥타브 출력 레벨을 0.03 dB 이내로 사전 예측했습니다.',
      'L-ISA의 초기 높이 예측은 한 배치에서 최대 54.4 dB로 실패했습니다. 후속 시험은 스피커 UUID에 따른 삼각분할 규칙을 시험한 배치에서 지지했습니다. 거울상 배치의 예외 한 건과 더 많은 꼭짓점이 같은 평면에 있는 경우는 미해결입니다.',
      'L-ISA의 폭 조절은 일부 구조만 식별했습니다. 딜레이 동작에 관한 결과는 시험한 Desktop 구성에 한정됩니다. 전기적 출력 측정으로 청감이나 실제 객석에서의 성능을 검증한 것은 아닙니다.',
      'Sound xR은 주로 정적 출력 레벨을 분석했습니다. 이번 비교에서 주파수·지연 특성을 독립적으로 다시 측정하지 않았으므로, 해당 처리가 전혀 없다고 일반화할 수는 없습니다.',
    ],
    reportsTitle: '보고서와 측정 자료',
    reportsNote: '실험 방법, 수식, 예측 결과와 미해결 내용을 담았습니다. L-ISA 보고서는 현재 한국어로 제공됩니다.',
    nextTitle: '다음에 확인할 질문',
    next: '스피커가 불규칙하게 놓여 있을 때 L-ISA는 넓은 소리를 어떻게 분배할까? 두 시스템은 소리가 움직이는 동안 어떻게 반응할까?',
  },
};

export function RendererStudy({ locale, resources }: { locale: Locale; resources: ProjectResource[] }) {
  const text = copy[locale];
  return <div className="renderer-study">
    <p className="renderer-intro">{text.intro}</p>
    <div className="renderer-studies">
      {text.studies.map(study => <section className="renderer-study-item" key={study.name}>
        <p className="renderer-study-name">{study.name}</p>
        <h2>{study.title}</h2>
        <p>{study.method}</p>
        <p>{study.finding}</p>
      </section>)}
    </div>
    <section className="renderer-explanation">
      <h2>{text.comparisonTitle}</h2><p>{text.comparison}</p>
      <h2>{text.methodTitle}</h2><p>{text.method}</p>
      <details className="renderer-details">
        <summary>{text.detailsTitle}</summary>
        <div>{text.details.map(detail => <p key={detail}>{detail}</p>)}</div>
      </details>
    </section>
    <section className="renderer-reports" id="research-reports">
      <h2>{text.reportsTitle}</h2><p>{text.reportsNote}</p>
      <div className="report-links">{resources.map(resource => <a
        key={resource.href}
        href={resource.localized ? localizedPath(locale, resource.href) : resource.href}
        {...(!resource.localized ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >{resource.label[locale]}</a>)}</div>
    </section>
    <section className="renderer-next"><h2>{text.nextTitle}</h2><p>{text.next}</p></section>
  </div>;
}
