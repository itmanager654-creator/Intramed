import { SITE } from '@/lib/site';

// One place that builds complete, consistent metadata (title, description, canonical, Open Graph, Twitter).
export function buildMeta({ title, description, path = '/', image, keywords }) {
  const img = image || '/og-image.png';
  return {
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    alternates: { canonical: path },
    openGraph: { title, description, url: `${SITE.url}${path}`, siteName: SITE.name, type: 'website', locale: 'en_PK', images: [{ url: img }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}

// Target keywords per speciality (used as meta keywords on category pages).
export const CATEGORY_KEYWORDS = {
  cardiology: ['cath lab devices Pakistan', 'interventional cardiology devices', 'cardiology devices Pakistan', 'cardiac stent Pakistan', 'angioplasty balloon Pakistan', 'guidewire Pakistan', 'angiography supplies Pakistan'],
  gastroenterology: ['gastroenterology devices Pakistan', 'endoscopy devices Pakistan', 'biliary stent Pakistan', 'ERCP accessories Pakistan', 'colonoscopy supplies Pakistan'],
  urology: ['urology devices Pakistan', 'ureteral stent Pakistan', 'urology disposables Pakistan', 'urinary catheter Pakistan', 'ureteroscopy supplies Pakistan'],
  'surgical-medical-supplies': ['doctor coat price Pakistan', 'lab coat Pakistan', 'nurse coat Pakistan', 'nurse uniform Pakistan', 'patient clothes Pakistan', 'medical scrubs Pakistan', 'OT uniform Pakistan', 'apron for doctors Pakistan', 'surgical supplies Lahore'],
  vascular: ['vascular devices Pakistan', 'vascular disposables Pakistan', 'angiography sheath Pakistan', 'PTA balloon Pakistan', 'peripheral vascular devices'],
};
