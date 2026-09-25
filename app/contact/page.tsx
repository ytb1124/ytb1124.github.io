import { PageShell, HeroTitle } from '../components/site';
import { site } from '../data/site';
import Image from 'next/image';

export const dynamic = 'force-static';

export default function ContactPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  return <PageShell locale={locale} path="/contact"><HeroTitle>Contact</HeroTitle><section className="contact-grid content-width"><div className="contact-details"><div><span>Phone (WhatsApp)</span><a href={site.contact.phoneHref}>{site.contact.phone}</a></div><div><span>Address</span><p>{site.contact.address}</p></div><div><span>Email</span><a href={site.contact.emailHref}>{site.contact.email}</a></div><div><span>KakaoTalk ID</span><p>{site.contact.kakao}</p></div></div><Image src="/images/contact.jpg" alt="Tree branches reach towards a clear, blue sky." width={500} height={500} /></section></PageShell>;
}
