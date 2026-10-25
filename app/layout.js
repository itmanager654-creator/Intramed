import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: 'Medical Devices Supplier & Distributor in Pakistan | IntraMed Solution',
  description: 'IntraMed Solution — medical devices supplier & distributor in Pakistan. Cardiology, urology, gastroenterology & vascular disposable devices for hospitals nationwide.',
  openGraph: { siteName: SITE.name, type: 'website', images: ['/logo.png'] },
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
};

const org = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/logo.png`,
  telephone: SITE.phone,
  email: SITE.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressRegion: 'Punjab', addressCountry: 'PK' },
  areaServed: [...SITE.cities.map((c) => ({ '@type': 'City', name: c })), { '@type': 'Country', name: 'Pakistan' }],
};

const themeInit = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <JsonLd data={org} />
      </body>
    </html>
  );
}
