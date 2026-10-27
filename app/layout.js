import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { SITE } from '@/lib/site';
import { getContent, contactOf } from '@/lib/content';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: { default: 'Medical Devices Supplier & Distributor in Pakistan | IntraMed Solution', template: '%s' },
  description: 'IntraMed Solution — medical devices supplier & distributor in Pakistan.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

// Light theme is the default. Dark only if the visitor chose it with the toggle.
const themeInit = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default async function RootLayout({ children }) {
  const t = await getContent();
  const ct = contactOf(t);
  const social = ct.social.map(([, v]) => v);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalBusiness', 'LocalBusiness'],
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` },
        image: `${SITE.url}/logo.png`,
        description: 'Medical devices supplier and distributor in Pakistan: cardiology, urology, gastroenterology and vascular disposable devices.',
        telephone: ct.phone,
        email: ct.email,
        address: { '@type': 'PostalAddress', streetAddress: ct.address, addressLocality: 'Lahore', addressRegion: 'Punjab', addressCountry: 'PK' },
        areaServed: [...SITE.cities.map((c) => ({ '@type': 'City', name: c })), { '@type': 'Country', name: 'Pakistan' }],
        founder: { '@id': `${SITE.url}/#founder` },
        contactPoint: { '@type': 'ContactPoint', telephone: ct.tel || ct.phone, contactType: 'sales', areaServed: 'PK', availableLanguage: ['English', 'Urdu'] },
        knowsAbout: ['Cardiology devices', 'Urology devices', 'Gastroenterology devices', 'Vascular devices', 'Disposable surgical devices'],
        ...(ct.maps ? { hasMap: ct.maps } : {}),
        ...(social.length ? { sameAs: social } : {}),
      },
      {
        '@type': 'Person',
        '@id': `${SITE.url}/#founder`,
        name: t('about.leaderName'),
        jobTitle: 'CEO',
        worksFor: { '@id': `${SITE.url}/#organization` },
        description: t('about.leaderNote'),
      },
      { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: SITE.url, name: SITE.name, publisher: { '@id': `${SITE.url}/#organization` }, inLanguage: 'en' },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp number={ct.wa} message={ct.waMsg} />
        <JsonLd data={graph} />
      </body>
    </html>
  );
}
