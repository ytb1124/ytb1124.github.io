import studyDocument from '../../content/sound-xr-image-study.json';
import { PageShell } from './site';
import type { Locale } from '../data/site';

const projectPath='/projects/spatial-renderer-system-identification';

function localizedPath(locale:Locale,path:string){return locale==='ko'?`/ko${path}`:path}

function PublicationLinks({locale,current}:{locale:Locale;current:'report'|'data'}) {
  const labels=locale==='ko'?{
    project:'프로젝트로 돌아가기',report:'결과보고서',data:'실험 데이터',download:'원본 파일 다운로드'
  }:{project:'Back to project',report:'Research report',data:'Experiment data',download:'Download source file'};
  return <nav className="publication-links" aria-label={locale==='ko'?'연구 자료':'Research materials'}>
    <a href={localizedPath(locale,projectPath)}>{labels.project} →</a>
    {current!=='report'&&<a href={localizedPath(locale,`${projectPath}/report`)}>{labels.report} →</a>}
    {current!=='data'&&<a href={localizedPath(locale,`${projectPath}/data`)}>{labels.data} →</a>}
    <a href={current==='report'?(locale==='ko'?'/reports/sound-xr-image-renderer-report-ko.pdf':'/reports/sound-xr-image-renderer-report-en.pdf'):'/downloads/afc-renderer-experiment.xlsx'} {...(current==='report'?{target:'_blank',rel:'noopener noreferrer'}:{download:true})}>{current==='report'?(locale==='ko'?'PDF 새 창으로 열기':'Open PDF in new tab'):labels.download} {current==='report'?'↗':'↓'}</a>
  </nav>
}

export function SoundXrReport({locale}:{locale:Locale}) {
  const report=studyDocument[locale];
  const metadata=studyDocument.metadata;
  return <PageShell locale={locale} path={`${projectPath}/report`}>
    <article className="publication-page content-width">
      <header className="publication-header">
        <span>RESEARCH REPORT / {metadata.year}</span>
        <h1>{report.title}</h1>
        <p>{report.subtitle}</p>
        <div className="publication-meta"><span>{metadata.date}</span><span>REVISION {metadata.revision}</span></div>
        <PublicationLinks locale={locale} current="report" />
      </header>
      <div className="publication-paper">
        <section className="publication-abstract">
          <h2>{locale==='ko'?'초록':'Abstract'}</h2>
          <p>{report.abstract}</p>
          <p className="publication-keywords"><strong>{locale==='ko'?'주요어':'Keywords'}</strong> {report.keywords.join(' · ')}</p>
        </section>
        {report.sections.map(section=><section className="publication-section" key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
          {section.equations.length>0&&<div className="publication-equations">{section.equations.map(equation=><figure className="publication-equation" key={equation.id}>
            {/* Keyboard focus enables horizontal scrolling of long vector equations. */}
            {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <section className="publication-equation-scroll" tabIndex={0} aria-label={equation.alt}><picture><img src={equation.src} alt={equation.alt} /></picture></section>
            <figcaption>({Number(equation.id)})</figcaption>
          </figure>)}</div>}
          {section.tables.map(table=><div className="dataset-table-wrap" key={table.caption}><table><caption>{table.caption}</caption><thead><tr>{table.columns.map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row,index)=><tr key={index}>{row.map((value,col)=><td key={col}>{value}</td>)}</tr>)}</tbody></table></div>)}
        </section>)}
        <section className="publication-note">
          <h2>{locale==='ko'?'자료 범위':'Data scope'}</h2>
          <p>{locale==='ko'?`원본 측정 기록은 ${metadata.sourceWorkbook}로 구성되며, 실험 데이터 페이지에서 핵심 블록과 대표 값을 바로 확인할 수 있습니다.`:`The source measurements comprise ${metadata.sourceWorkbook}. The experiment data page presents the core blocks and representative values for direct review.`}</p>
        </section>
      </div>
    </article>
  </PageShell>
}

export function SoundXrDataPreview({locale}:{locale:Locale}) {
  const data=studyDocument.dataPreview;
  const metadata=studyDocument.metadata;
  return <PageShell locale={locale} path={`${projectPath}/data`}>
    <article className="publication-page content-width">
      <header className="publication-header">
        <span>EXPERIMENT DATA / {metadata.year}</span>
        <h1>{locale==='ko'?'Sound xR Image 실험 데이터':'Sound xR Image Experiment Data'}</h1>
        <p>{locale==='ko'?'렌더러 출력 게인 측정의 핵심 블록과 대표 기록을 웹에서 확인합니다.':'Review the core measurement blocks and representative renderer gain records in the browser.'}</p>
        <div className="publication-meta"><span>{metadata.sourceWorkbook}</span><span>GAIN UNIT dB</span></div>
        <PublicationLinks locale={locale} current="data" />
      </header>
      <div className="publication-paper data-preview-paper">
        <section className="publication-abstract">
          <h2>{locale==='ko'?'데이터 구성':'Dataset structure'}</h2>
          <p>{locale==='ko'?'원본 워크북은 조건별 측정 블록을 한 시트에 기록합니다. 아래 인덱스는 분석에 사용한 주요 범위이며, 이어지는 표는 핵심 결론을 확인할 수 있는 대표 기록입니다. x 표기는 원시 기록을 유지한 값으로 디지털 무음을 뜻한다고 단정하지 않습니다.':'The source workbook stores condition based measurement blocks in one sheet. The index below lists the principal ranges used in the analysis, followed by representative records supporting the main findings. The raw marker x is preserved and is not assumed to mean digital silence.'}</p>
          <div className="dataset-index">{data.blocks.map(block=><div key={block.range}><span>{block.range}</span><p>{locale==='ko'?block.ko:block.en}</p></div>)}</div>
        </section>
        {data.tables.map(table=><section className="publication-section dataset-section" key={table.id}>
          <h2>{locale==='ko'?table.titleKo:table.titleEn}</h2>
          <p className="dataset-note">{locale==='ko'?table.noteKo:table.noteEn}</p>
          <div className="dataset-table-wrap"><table><thead><tr>{table.columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row,rowIndex)=><tr key={rowIndex}>{row.map((value,columnIndex)=><td key={`${rowIndex}-${columnIndex}`}>{value}</td>)}</tr>)}</tbody></table></div>
        </section>)}
        <section className="publication-note">
          <h2>{locale==='ko'?'해석 범위':'Interpretation limits'}</h2>
          <p>{locale==='ko'?'표의 값은 후보 모델을 검토하기 위한 전기적 출력 기록입니다. 청취 품질, 주파수 응답, 위상, 시간 응답 또는 제품 내부 구현을 직접 검증한 결과가 아닙니다.':'These values are electrical output records used to evaluate candidate models. They do not directly validate listening quality, frequency response, phase, time response, or the product’s internal implementation.'}</p>
        </section>
      </div>
    </article>
  </PageShell>
}
