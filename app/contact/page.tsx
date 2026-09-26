import { PageShell, HeroTitle } from '../components/site';
import { site } from '../data/site';
import Image from 'next/image';

export const dynamic = 'force-static';

export default function ContactPage({ locale = 'en' as const }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  return <PageShell locale={locale} path="/contact"><HeroTitle locale={locale}>{ko ? '연락처' : 'Contact'}</HeroTitle><section className="contact-grid content-width"><div className="contact-details"><div><span>{ko ? '전화·WhatsApp' : 'Phone (WhatsApp)'}</span><a href={site.contact.phoneHref}>{site.contact.phone}</a></div><div><span>{ko ? '활동 지역' : 'Address'}</span><p>{ko ? '서울, 대한민국' : site.contact.address}</p></div><div><span>{ko ? '이메일' : 'Email'}</span><a href={site.contact.emailHref}>{site.contact.email}</a></div><div><span>{ko ? '카카오톡 ID' : 'KakaoTalk ID'}</span><p>{site.contact.kakao}</p></div></div><Image src="/framer/contact/contact.jpg" alt={ko ? '맑고 푸른 하늘을 향해 뻗은 나뭇가지' : 'Tree branches reach towards a clear, blue sky.'} width={500} height={500} /></section></PageShell>;
}
