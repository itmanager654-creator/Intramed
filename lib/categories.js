// The four specialities. "key" is the value stored in the database.
export const CATEGORIES = [
  {
    slug: 'gastroenterology-devices', key: 'Gastroenterology', name: 'Gastroenterology',
    lead: 'ERCP guide wires, sphincterotomes, biopsy forceps and PEG feeding sets for endoscopic procedures.',
    items: ['ERCP Guide Wires', 'Sphincterotomes', 'Biopsy Forceps', 'PEG Feeding Sets', 'Endoscopy Accessories'],
    users: 'endoscopy units and gastroenterology departments',
  },
  {
    slug: 'cardiology-devices', key: 'Cardiology', name: 'Cardiology',
    lead: 'Cath-lab and interventional cardiology disposables: catheters, guidewires, balloons and hemostasis devices.',
    items: ['Diagnostic Coronary Angiography Catheters', 'Coronary Angioplasty Balloon Catheters (PTCA)', 'Coronary Stenting Devices', 'Cath-Lab Guidewires', 'Vascular Closure & Hemostasis Devices', 'Radial & Femoral Access Sheaths'],
    users: 'cath-labs and cardiac centers',
  },
  {
    slug: 'urology-devices', key: 'Urology', name: 'Urology',
    lead: 'Foley catheters, ureteral stents, endourology guidewires and drainage sets for urology departments.',
    items: ['Two-Way & Three-Way Foley Catheters', 'Ureteral Stents (JJ / Double-J)', 'Endourology Guidewires', 'Suprapubic Catheter Sets', 'Urine Drainage Bags', 'Nelaton & Intermittent Catheters'],
    users: 'urology departments and hospitals',
  },
  {
    slug: 'vascular-devices', key: 'Vascular', name: 'Vascular',
    lead: 'Peripheral vascular access sheaths, guidewires and angiography catheters for interventional procedures.',
    items: ['Vascular Access Sheaths', 'Peripheral Guidewires', 'Angiography Catheters', 'Interventional Vascular Accessories'],
    users: 'interventional radiology and vascular departments',
  },
  {
    slug: 'surgical-medical-supplies', key: 'Surgical', name: 'Surgical & General Medical Supplies',
    lead: 'Doctor coats, lab coats, nurse uniforms, patient clothing and general hospital supplies for hospitals and clinics across Pakistan.',
    items: ['Doctor Coats & Lab Coats', 'Nurse Uniforms & Scrubs', 'Patient Clothing & Gowns', 'Hospital Linen & General Supplies'],
    users: 'hospitals, clinics, medical colleges and surgical teams',
    seoTitle: 'Doctor Coat, Nurse Coat & Surgical Supplies in Pakistan | Lahore – IntraMed Solution',
    h1: 'Doctor Coat, Nurse Uniform & Surgical Supplies in Pakistan',
    faqs: [
      ['Where can I buy doctor coats and lab coats in Pakistan?', 'IntraMed Solution supplies doctor coats, lab coats and nurse uniforms to hospitals, clinics and individual doctors in Lahore, Karachi, Islamabad and across Pakistan. Send an inquiry or call us for sizes, colours and quantity pricing.'],
      ['Do you sell nurse coats and nurse uniforms?', 'Yes. We supply nurse coats, scrubs and uniforms in standard sizes. Tell us the size and quantity you need and we will send a quotation.'],
      ['Do you supply patient clothing and gowns?', 'Yes. We supply patient clothing and gowns for hospital wards and clinics. Bulk orders for hospitals are welcome.'],
      ['Can I order custom embroidery or a hospital logo on coats?', 'Custom work depends on the item and quantity. Send us your requirement through the inquiry form and we will confirm what is possible.'],
      ['Can I order in bulk for a hospital or medical college?', 'Yes. We supply bulk quantities for hospitals, clinics, medical colleges and surgical teams, with one quotation for the whole order.'],
      ['How fast do you deliver?', 'Same-day or next-day delivery in Lahore, and 2-3 business days across Pakistan.'],
    ],
  },
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const getCategoryByKey = (key) => CATEGORIES.find((c) => c.key === key);

export function categoryFaqs(c, phone = '') {
  if (c.faqs) return c.faqs;
  const n = c.name.toLowerCase();
  return [
    [`Where can I buy ${n} devices in Pakistan?`, `IntraMed Solution supplies sterile, single-use ${n} devices to ${c.users} in Lahore, Karachi, Islamabad and across Pakistan. ${phone ? `Call ${phone} or send` : 'Send'} an inquiry for a quotation.`],
    [`Are you a ${n} devices supplier or distributor?`, `Both. We supply directly from ready Lahore stock and also work as a distributor for hospitals that source ${n} products in volume through a single, traceable supply relationship.`],
    [`How fast do you deliver ${n} devices?`, `Same-day or next-day delivery in Lahore, and 2-3 business days across Pakistan.`],
    [`Are your ${n} devices sterile and single-use?`, `Yes. Every device we supply is sterile, single-use and sourced to international quality standards.`],
  ];
}
