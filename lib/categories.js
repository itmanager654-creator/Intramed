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
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const getCategoryByKey = (key) => CATEGORIES.find((c) => c.key === key);

export function categoryFaqs(c) {
  const n = c.name.toLowerCase();
  return [
    [`Where can I buy ${n} devices in Pakistan?`, `IntraMed Solution supplies sterile, single-use ${n} devices to ${c.users} in Lahore, Karachi, Islamabad and across Pakistan. Call 0346 4711440 or send an inquiry for a quotation.`],
    [`Are you a ${n} devices supplier or distributor?`, `Both. We supply directly from ready Lahore stock and also work as a distributor for hospitals that source ${n} products in volume through a single, traceable supply relationship.`],
    [`How fast do you deliver ${n} devices?`, `Same-day or next-day delivery in Lahore, and 2-3 business days across Pakistan.`],
    [`Are your ${n} devices sterile and single-use?`, `Yes. Every device we supply is sterile, single-use and sourced to international quality standards.`],
  ];
}
