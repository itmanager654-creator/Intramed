// Organ and supply illustrations for category pages and homepage cards (static, trusted markup).
// Keys match the category slugs in lib/categories.js.
export const ORGANS = {
  'gastroenterology-devices': `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stomach illustration">
<defs>
<linearGradient id="stg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#27bfb3"/><stop offset="0.55" stop-color="#0d8a8a"/><stop offset="1" stop-color="#075a5f"/></linearGradient>
<linearGradient id="stt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4ed0c4"/><stop offset="1" stop-color="#0d8a8a"/></linearGradient>
</defs>
<path d="M166 18 L166 118" stroke="#1aa89c" stroke-width="34" stroke-linecap="round" fill="none"/>
<path d="M150 112 C 100 130, 66 200, 82 268 C 98 338, 176 372, 246 347 C 306 325, 338 270, 324 214 C 314 174, 286 158, 262 167 C 240 175, 238 204, 222 219 C 205 234, 182 224, 180 198 C 178 168, 192 138, 186 106 Z" fill="url(#stg)"/>
<path d="M324 216 C 352 204, 370 172, 358 138 C 351 117, 328 106, 308 116" stroke="#1aa89c" stroke-width="24" stroke-linecap="round" fill="none"/>
<g fill="none" stroke="#bff3ec" stroke-width="5" stroke-linecap="round" opacity="0.55">
<path d="M120 180 C 140 200, 170 215, 205 250"/><path d="M104 232 C 135 250, 175 270, 220 300"/><path d="M118 292 C 150 305, 190 318, 238 322"/>
</g>
<ellipse cx="128" cy="215" rx="16" ry="44" transform="rotate(18 128 215)" fill="#ffffff" opacity="0.18"/>
</svg>`,

  'cardiology-devices': `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Human heart illustration">
<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5484d"/><stop offset="0.6" stop-color="#b3151b"/><stop offset="1" stop-color="#7a0b10"/></linearGradient></defs>
<path d="M200 352 C 150 316, 66 262, 52 180 C 40 112, 84 70, 136 74 C 166 76, 186 96, 200 124 C 214 96, 234 76, 264 74 C 316 70, 360 112, 348 180 C 334 262, 250 316, 200 352 Z" fill="url(#hg)"/>
<path d="M176 118 C 170 80, 176 46, 204 30 C 214 24, 226 28, 226 40" stroke="#f08a8e" stroke-width="22" stroke-linecap="round" fill="none"/>
<path d="M176 118 C 170 80, 176 46, 204 30 C 214 24, 226 28, 226 40" stroke="#c4161c" stroke-width="10" stroke-linecap="round" fill="none"/>
<path d="M248 92 C 262 60, 298 52, 318 70" stroke="#3b6fb6" stroke-width="12" stroke-linecap="round" fill="none"/>
<path d="M120 200 C 150 170, 176 170, 196 190" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.35"/>
<path d="M118 212 C 130 196, 140 186, 152 180" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.3"/>
<path d="M200 130 L 200 330" stroke="#7a0b10" stroke-width="3" opacity="0.25"/>
</svg>`,

  'urology-devices': `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Urinary bladder illustration">
<defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d27a"/><stop offset="0.6" stop-color="#e0a33a"/><stop offset="1" stop-color="#b87a1c"/></linearGradient></defs>
<path d="M150 40 C 140 80, 150 110, 160 128" stroke="#e7b9a0" stroke-width="16" stroke-linecap="round" fill="none"/>
<path d="M252 40 C 262 80, 252 110, 242 128" stroke="#e7b9a0" stroke-width="16" stroke-linecap="round" fill="none"/>
<path d="M120 170 C 110 118, 170 104, 200 104 C 230 104, 290 118, 280 170 C 270 240, 262 300, 200 306 C 138 300, 130 240, 120 170 Z" fill="url(#bg2)" stroke="#a46a14" stroke-width="3"/>
<path d="M200 300 L 200 372" stroke="#e7b9a0" stroke-width="18" stroke-linecap="round"/>
<path d="M150 150 C 160 136, 176 132, 190 136" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.45"/>
<path d="M158 200 C 164 190, 170 186, 178 184" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.35"/>
</svg>`,

  'vascular-devices': `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blood vessel network illustration">
<g fill="none" stroke-linecap="round">
<path d="M200 390 C 200 320, 200 270, 200 214" stroke="#3b6fb6" stroke-width="30"/>
<path d="M200 270 C 160 244, 128 230, 96 160" stroke="#3b6fb6" stroke-width="20"/>
<path d="M200 250 C 244 220, 280 206, 312 130" stroke="#c4161c" stroke-width="20"/>
<path d="M130 232 C 108 222, 84 220, 58 226" stroke="#3b6fb6" stroke-width="12"/>
<path d="M104 176 C 86 152, 80 124, 88 92" stroke="#3b6fb6" stroke-width="10"/>
<path d="M270 212 C 296 190, 326 186, 352 196" stroke="#c4161c" stroke-width="10"/>
<path d="M300 146 C 312 122, 336 108, 360 112" stroke="#c4161c" stroke-width="9"/>
<path d="M200 300 C 230 300, 262 306, 290 330" stroke="#3b6fb6" stroke-width="9"/>
<path d="M200 330 C 170 326, 140 332, 112 352" stroke="#c4161c" stroke-width="9"/>
<path d="M200 214 L 200 150" stroke="#c4161c" stroke-width="14"/>
<path d="M200 150 C 190 110, 176 86, 150 64" stroke="#3b6fb6" stroke-width="8"/>
<path d="M200 150 C 214 110, 230 90, 256 70" stroke="#c4161c" stroke-width="8"/>
</g>
<g fill="#ffffff" opacity="0.35"><circle cx="150" cy="64" r="4"/><circle cx="256" cy="70" r="4"/><circle cx="88" cy="92" r="3.5"/><circle cx="360" cy="112" r="3.5"/><circle cx="58" cy="226" r="3.5"/><circle cx="352" cy="196" r="3.5"/></g>
</svg>`,

  'surgical-medical-supplies': `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Doctor coat illustration">
<defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe6ee"/></linearGradient></defs>
<path d="M150 58 L 118 80 L 66 110 C 56 116, 54 128, 60 140 L 92 214 C 96 224, 106 226, 112 218 L 118 208 L 118 354 C 118 364, 126 370, 136 370 L 264 370 C 274 370, 282 364, 282 354 L 282 208 L 288 218 C 294 226, 304 224, 308 214 L 340 140 C 346 128, 344 116, 334 110 L 282 80 L 250 58 C 236 74, 164 74, 150 58 Z" fill="url(#cg)" stroke="#5d6b7a" stroke-width="6" stroke-linejoin="round"/>
<path d="M200 100 L 200 370" stroke="#9aa7b4" stroke-width="4"/>
<path d="M150 58 L 186 130 L 200 118 L 214 130 L 250 58" fill="none" stroke="#5d6b7a" stroke-width="6" stroke-linejoin="round"/>
<circle cx="200" cy="170" r="6" fill="#3b6fb6"/><circle cx="200" cy="222" r="6" fill="#3b6fb6"/><circle cx="200" cy="274" r="6" fill="#3b6fb6"/>
<rect x="144" y="282" width="34" height="22" rx="4" fill="none" stroke="#5d6b7a" stroke-width="4"/>
<rect x="222" y="282" width="34" height="22" rx="4" fill="none" stroke="#5d6b7a" stroke-width="4"/>
<path d="M170 318 L 230 318" stroke="#c4161c" stroke-width="10" stroke-linecap="round"/>
<path d="M200 288 L 200 348" stroke="#c4161c" stroke-width="10" stroke-linecap="round" opacity="0"/>
</svg>`,
};
