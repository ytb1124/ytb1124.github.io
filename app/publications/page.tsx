import { PageIntro } from '../components/page-intro';
import { PageShell } from '../components/site';
import { SelectedWriting } from '../components/selected-writing';
import { site } from '../data/site';

export const dynamic = 'force-static';

export default function PublicationsPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  return <PageShell locale={locale} path="/publications">
    <div className="experience-essential overview-page">
      <PageIntro eyebrow={ko ? '논문 · 발표 · 기고' : 'Papers · Presentations · Articles'} title={ko ? '논문과 발표' : 'Publications'}
        aside={<a className="pill-link" href={site.socials.cv} target="_blank" rel="noopener noreferrer">{ko ? 'CV 보기 ↗' : 'View CV ↗'}</a>}
      />
      <SelectedWriting locale={locale} />
    </div>
  </PageShell>;
}
