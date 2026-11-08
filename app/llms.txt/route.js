import { query } from '@/lib/db';
import { CATEGORIES, getCategoryByKey } from '@/lib/categories';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await query`select slug, name, category from products order by category, sort, id`;
  const lines = [
    '# IntraMed Solution',
    '',
    '> Medical devices supplier and distributor in Pakistan, based in Lahore. Sterile, single-use cardiology, urology, gastroenterology and vascular devices for hospitals, clinics and cath-labs across Pakistan (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta). Quotations and delivery in 2-3 business days.',
    '',
    `Contact: ${SITE.url}/contact/ | Phone and WhatsApp listed on the contact page | Email: info@intramedsolution.com`,
    '',
    '## Specialities',
    ...CATEGORIES.map((c) => `- [${c.name} Devices](${SITE.url}/${c.slug}/)`),
    '',
    '## Products',
    ...products.map((p) => {
      const c = getCategoryByKey(p.category);
      return c ? `- [${p.name}](${SITE.url}/${c.slug}/${p.slug}/): ${c.name} device` : null;
    }).filter(Boolean),
    '',
    '## Other pages',
    `- [About us](${SITE.url}/about/)`,
    `- [Gallery](${SITE.url}/gallery/)`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
