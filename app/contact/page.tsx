import { PageShell } from '../components/site';
import { site } from '../data/site';
import Image from 'next/image';

export const dynamic = 'force-static';

export default function ContactPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const copy = site.pageContent[locale].contact;
  return <PageShell locale={locale} path="/contact"><div className="contact-overview overview-page"><header className="overview-header"><span className="section-eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p></header><section className="contact-compact"><div className="contact-details"><div><span>{ko?'이메일':'Email'}</span><a href={site.contact.emailHref}>{site.contact.email}</a></div><div><span>{ko?'전화·WhatsApp':'Phone / WhatsApp'}</span><a href={site.contact.phoneHref}>{site.contact.phone}</a></div><div><span>{ko?'활동 지역':'Based in'}</span><p>{copy.location}</p></div><div><span>{ko?'카카오톡 ID':'KakaoTalk ID'}</span><p>{site.contact.kakao}</p></div></div><Image src="/framer/contact/contact.jpg" alt="" width={300} height={300}/></section></div></PageShell>;
}
