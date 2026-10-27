// Every editable piece of text on the website. The admin "Website text" tab edits these;
// anything not edited falls back to the default written here.
import { cache } from 'react';
import { query } from '@/lib/db';
import { CATEGORIES } from '@/lib/categories';
import { SITE } from '@/lib/site';

const cities = SITE.cities.join(', ');

// [key, group, label, type ('text' | 'area'), default]
function baseFields() {
  return [
    ['contact.phone', 'Contact details', 'Phone number (shown on the website)', 'text', '0346 4711440'],
    ['contact.whatsapp', 'Contact details', 'WhatsApp number (with country code, digits only, e.g. 923464711440)', 'text', '923464711440'],
    ['contact.waMsg', 'Contact details', 'WhatsApp button: ready-made message', 'text', 'Hello IntraMed Solution, I would like to inquire about your medical devices.'],
    ['contact.email', 'Contact details', 'Email', 'text', 'info@intramedsolution.com'],
    ['contact.address', 'Contact details', 'Full address', 'text', 'Lahore, Punjab, Pakistan'],
    ['contact.hours', 'Contact details', 'Working hours (optional)', 'text', ''],
    ['contact.maps', 'Contact details', 'Google Maps link (optional)', 'text', ''],
    ['contact.facebook', 'Contact details', 'Facebook page link (optional)', 'text', ''],
    ['contact.instagram', 'Contact details', 'Instagram link (optional)', 'text', ''],
    ['contact.linkedin', 'Contact details', 'LinkedIn link (optional)', 'text', ''],

    ['home.seoTitle', 'Homepage', 'Google title (SEO)', 'text', 'Medical Devices Supplier & Distributor in Pakistan | Cardiology, Urology, Gastroenterology, Vascular – IntraMed Solution'],
    ['home.seoDesc', 'Homepage', 'Google description (SEO)', 'area', 'IntraMed Solution — medical devices supplier & distributor in Pakistan. Cardiology, urology, gastroenterology & vascular disposable devices delivered to hospitals in Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar & nationwide.'],
    ['home.eyebrow', 'Homepage', 'Small line above the main title', 'text', 'Medical devices supplier & distributor in Pakistan'],
    ['home.title1', 'Homepage', 'Main title (black part)', 'text', 'INTRAMED'],
    ['home.title2', 'Homepage', 'Main title (red part)', 'text', 'SOLUTION'],
    ['home.lead', 'Homepage', 'Main paragraph', 'area', 'Sterile, single-use cardiology, urology, gastroenterology and vascular devices, delivered from Lahore to hospitals and clinics across Pakistan.'],
    ['home.cta1', 'Homepage', 'Button 1 text', 'text', 'Explore products'],
    ['home.cta2', 'Homepage', 'Button 2 text', 'text', 'Contact us'],
    ['home.stat1n', 'Homepage', 'Stat 1 number', 'text', '16+'],
    ['home.stat1l', 'Homepage', 'Stat 1 label', 'text', 'Device types'],
    ['home.stat2n', 'Homepage', 'Stat 2 number', 'text', '4'],
    ['home.stat2l', 'Homepage', 'Stat 2 label', 'text', 'Specialities'],
    ['home.stat3n', 'Homepage', 'Stat 3 number', 'text', '100%'],
    ['home.stat3l', 'Homepage', 'Stat 3 label', 'text', 'Sterile, disposable'],
    ['home.specHeading', 'Homepage', 'Specialities heading', 'text', 'Purpose-built for four critical specialities'],
    ['home.aboutHeading', 'Homepage', 'About section heading', 'text', 'About IntraMed Solution'],
    ['home.pkHeading', 'Homepage', 'Pakistan section heading', 'text', 'Medical Devices Supplier & Distributor Across Pakistan'],
    ['home.pkText', 'Homepage', 'Pakistan section text', 'area', `IntraMed Solution is a medical devices supplier and distributor in Pakistan, headquartered in Lahore. We deliver disposable cardiology, urology, gastroenterology and vascular devices to hospitals, cath-labs, endoscopy units and clinics in ${cities}, with nationwide delivery in 2-3 business days.`],
    ['home.featuredHeading', 'Homepage', 'Featured products heading', 'text', 'Featured products'],
    ['home.partnersHeading', 'Homepage', 'Partners heading', 'text', 'Our partners'],
    ['home.clientsHeading', 'Homepage', 'Clients heading', 'text', 'Trusted by hospitals and clinics'],
    ['home.faqHeading', 'Homepage', 'FAQ heading', 'text', 'Frequently asked questions'],

    ['about.seoTitle', 'About us', 'Google title (SEO)', 'text', 'About IntraMed Solution | Medical Devices Supplier in Lahore, Pakistan – Led by Naeem Ahmed'],
    ['about.seoDesc', 'About us', 'Google description (SEO)', 'area', 'IntraMed Solution operates under the leadership of Naeem Ahmed with 15+ years of experience in surgical devices. Lahore-based supplier and distributor of cardiology, urology, gastroenterology and vascular devices across Pakistan.'],
    ['about.heading', 'About us', 'Heading', 'text', 'About IntraMed Solution'],
    ['about.p1', 'About us', 'Paragraph 1', 'area', 'IntraMed Solution operates under the leadership of Naeem Ahmed, who brings over 15 years of experience in surgical devices.'],
    ['about.p2', 'About us', 'Paragraph 2', 'area', 'Based in Lahore, we supply sterile, single-use cardiology, urology, gastroenterology and vascular devices to hospitals, cath-labs, endoscopy units and clinics across Pakistan. Every product is chosen for consistent quality, sterility and clinical performance, not just cost.'],
    ['about.p3', 'About us', 'Paragraph 3', 'area', `We partner with hospitals and procurement teams to deliver authentic, regulatory-compliant devices on time, with dedicated after-sales support, from Lahore to ${SITE.cities.slice(1, 7).join(', ')} and beyond.`],
    ['about.leaderName', 'About us', 'Leader name', 'text', 'Naeem Ahmed'],
    ['about.leaderRole', 'About us', 'Leader title', 'text', 'CEO, IntraMed Solution'],
    ['about.leaderNote', 'About us', 'Leader short line', 'text', '15+ years of experience in surgical devices'],
    ['about.vision', 'About us', 'Vision', 'area', "To become Pakistan's leading provider of innovative and reliable medical devices, improving patient outcomes by making advanced disposable technology accessible to every hospital and clinic in the country."],
    ['about.mission', 'About us', 'Mission', 'area', 'To provide affordable, high-quality, sterile disposable medical products, backed by on-time delivery and attentive service, so healthcare providers can focus on what matters most: patient care.'],

    ['site.tagline', 'Footer & other pages', 'Footer description', 'text', 'Medical devices supplier and distributor in Pakistan, based in Lahore.'],
    ['gallery.heading', 'Footer & other pages', 'Gallery page heading', 'text', 'Product gallery'],
    ['contact.heading', 'Footer & other pages', 'Contact page heading', 'text', 'Contact us'],
  ];
}

function catFields(c) {
  const n = c.name.toLowerCase();
  const g = `${c.name} page`;
  const p = `cat.${c.slug}.`;
  return [
    [p + 'seoTitle', g, 'Google title (SEO)', 'text', `${c.name} Devices Supplier & Distributor in Pakistan | Lahore, Karachi, Islamabad – IntraMed Solution`],
    [p + 'seoDesc', g, 'Google description (SEO)', 'area', `${c.name} devices supplier & distributor in Pakistan — based in Lahore, delivering to Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar & nationwide. Sterile disposable ${n} devices for hospitals.`],
    [p + 'h1', g, 'Main heading', 'text', `${c.name} Devices Supplier & Distributor in Pakistan`],
    [p + 'lead', g, 'Line under the heading', 'area', c.lead],
    [p + 'catalogHeading', g, 'Catalog heading', 'text', `${c.name} product catalog`],
    [p + 'introHeading', g, 'Text section heading', 'text', `${c.name} Devices in Lahore, Pakistan`],
    [p + 'intro', g, 'Text section paragraph', 'area', `IntraMed Solution is a Lahore-based supplier of disposable ${n} devices, serving ${c.users} across Pakistan. Every device is sterile, single-use and sourced to the specifications clinicians already trust, with ready stock and on-time delivery across Lahore and nationwide.`],
    [p + 'items', g, 'Device types list (one per line)', 'area', c.items.join('\n')],
    [p + 'pkHeading', g, 'Sub-heading 1', 'text', `${c.name} Devices Supplier in Pakistan`],
    [p + 'pk', g, 'Sub-heading 1 text', 'area', `As a dedicated ${n} devices supplier in Pakistan, IntraMed Solution delivers to hospitals, private clinics and government institutions in ${SITE.cities.slice(0, 7).join(', ')} and beyond. Nationwide orders are dispatched within 2-3 business days so ${c.users} never run short of essential disposables.`],
    [p + 'lhHeading', g, 'Sub-heading 2', 'text', `${c.name} Devices Supplier in Lahore`],
    [p + 'lh', g, 'Sub-heading 2 text', 'area', `In Lahore we hold ready stock of ${n} devices for same-day or next-day delivery, so local hospitals can restock without long lead times.`],
    [p + 'dsHeading', g, 'Sub-heading 3', 'text', `${c.name} Devices Distributor in Pakistan`],
    [p + 'ds', g, 'Sub-heading 3 text', 'area', `Beyond direct supply, we work as a ${n} devices distributor in Pakistan, partnering with international manufacturers to bring authentic, regulatory-compliant products to the local market, with consistent pricing, batch traceability and dedicated after-sales support.`],
  ];
}

export function allFields() {
  return [...baseFields(), ...CATEGORIES.flatMap(catFields)];
}

const DEFAULTS = Object.fromEntries(allFields().map(([k, , , , d]) => [k, d]));

// One database read per request, shared by every component that needs text.
export const getContent = cache(async () => {
  const rows = await query`select key, value from site_content`;
  const over = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return (key) => (over[key] !== undefined && over[key] !== '' ? over[key] : DEFAULTS[key] ?? '');
});

export async function getOverrides() {
  const rows = await query`select key, value from site_content`;
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function contactOf(c) {
  const wa = (c('contact.whatsapp') || '').replace(/\D/g, '');
  return {
    phone: c('contact.phone'),
    wa,
    tel: wa ? `+${wa}` : '',
    waMsg: c('contact.waMsg'),
    email: c('contact.email'),
    address: c('contact.address'),
    hours: c('contact.hours'),
    maps: c('contact.maps'),
    social: [['Facebook', c('contact.facebook')], ['Instagram', c('contact.instagram')], ['LinkedIn', c('contact.linkedin')]].filter(([, v]) => v),
  };
}
