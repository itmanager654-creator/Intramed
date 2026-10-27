// Decorative organ illustrations for the page heroes (static, trusted markup).
export const ORGANS = {
  gastroenterology: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stomach illustration">
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

  cardiology: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Heart illustration">
<defs>
<linearGradient id="htg" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#ef5a8a"/><stop offset="0.5" stop-color="#c2185b"/><stop offset="1" stop-color="#7d0f3c"/></linearGradient>
</defs>
<path d="M214 130 C 214 70, 272 46, 306 86" stroke="#a3124d" stroke-width="30" stroke-linecap="round" fill="none"/>
<path d="M176 128 C 166 84, 122 72, 98 98" stroke="#d63a78" stroke-width="22" stroke-linecap="round" fill="none"/>
<path d="M248 150 C 300 138, 330 150, 340 196" stroke="#e0527f" stroke-width="18" stroke-linecap="round" fill="none"/>
<path d="M200 360 C 82 276, 50 190, 80 136 C 108 88, 172 94, 200 142 C 228 94, 292 88, 320 136 C 350 190, 318 276, 200 360 Z" fill="url(#htg)"/>
<g fill="none" stroke="#ffc2d6" stroke-width="5" stroke-linecap="round" opacity="0.6">
<path d="M200 150 C 196 200, 176 250, 170 300"/><path d="M188 190 C 160 195, 130 210, 118 240"/><path d="M212 200 C 240 205, 262 222, 270 250"/>
</g>
<ellipse cx="122" cy="168" rx="16" ry="34" transform="rotate(28 122 168)" fill="#ffffff" opacity="0.22"/>
<path d="M30 372 L110 372 L128 340 L152 394 L176 356 L200 372 L370 372" stroke="#c2185b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8"/>
</svg>`,

  urology: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kidneys and bladder illustration">
<defs>
<linearGradient id="kdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0b429"/><stop offset="0.55" stop-color="#d98c10"/><stop offset="1" stop-color="#9a5b05"/></linearGradient>
<linearGradient id="bdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd56b"/><stop offset="1" stop-color="#d98c10"/></linearGradient>
</defs>
<path id="kidneyL" d="M118 30 C 74 36, 52 96, 70 146 C 82 178, 118 184, 128 156 C 133 142, 120 134, 118 120 C 116 102, 128 94, 142 86 C 160 74, 154 26, 118 30 Z" fill="url(#kdg)"/>
<path d="M282 30 C 326 36, 348 96, 330 146 C 318 178, 282 184, 272 156 C 267 142, 280 134, 282 120 C 284 102, 272 94, 258 86 C 240 74, 246 26, 282 30 Z" fill="url(#kdg)"/>
<g fill="none" stroke="#c97a0a" stroke-width="9" stroke-linecap="round">
<path d="M134 150 C 150 200, 168 240, 176 276"/><path d="M266 150 C 250 200, 232 240, 224 276"/>
</g>
<path d="M200 262 C 148 262, 136 322, 164 348 C 184 366, 216 366, 236 348 C 264 322, 252 262, 200 262 Z" fill="url(#bdg)"/>
<path d="M200 362 L200 392" stroke="#c97a0a" stroke-width="10" stroke-linecap="round"/>
<ellipse cx="96" cy="86" rx="10" ry="26" transform="rotate(14 96 86)" fill="#fff" opacity="0.25"/>
<ellipse cx="304" cy="86" rx="10" ry="26" transform="rotate(-14 304 86)" fill="#fff" opacity="0.25"/>
<ellipse cx="178" cy="312" rx="9" ry="22" fill="#fff" opacity="0.3"/>
</svg>`,

  vascular: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blood vessel network illustration">
<defs>
<linearGradient id="vag" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="400"><stop offset="0" stop-color="#7b5cf0"/><stop offset="1" stop-color="#4328b8"/></linearGradient>
<linearGradient id="vvg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="400"><stop offset="0" stop-color="#e0527f"/><stop offset="1" stop-color="#a3124d"/></linearGradient>
</defs>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="M200 14 L200 180" stroke="url(#vvg)" stroke-width="30"/>
<path d="M200 180 C 200 225, 138 235, 128 292 C 122 330, 128 360, 124 392" stroke="url(#vvg)" stroke-width="20"/>
<path d="M200 180 C 200 225, 262 235, 272 292 C 278 330, 272 360, 276 392" stroke="url(#vvg)" stroke-width="20"/>
<path d="M200 70 C 160 70, 120 62, 78 36" stroke="url(#vvg)" stroke-width="13"/>
<path d="M200 70 C 240 70, 280 62, 322 36" stroke="url(#vvg)" stroke-width="13"/>
<path d="M200 118 C 150 122, 110 140, 70 176" stroke="url(#vvg)" stroke-width="11"/>
<path d="M200 118 C 250 122, 290 140, 330 176" stroke="url(#vvg)" stroke-width="11"/>
<path d="M170 232 C 130 238, 96 262, 70 300" stroke="#e0527f" stroke-width="7"/>
<path d="M230 232 C 270 238, 304 262, 330 300" stroke="#e0527f" stroke-width="7"/>
<path d="M160 292 C 190 300, 214 312, 224 340" stroke="url(#vag)" stroke-width="12"/>
<path d="M240 292 C 212 300, 190 312, 182 340" stroke="url(#vag)" stroke-width="12"/>
<path d="M128 330 C 100 340, 82 356, 70 384" stroke="url(#vag)" stroke-width="9"/>
<path d="M272 330 C 300 340, 318 356, 330 384" stroke="url(#vag)" stroke-width="9"/>
</g>
<g fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35"><path d="M194 24 L194 170"/><path d="M122 300 C 118 330, 122 360, 118 386"/></g>
</svg>`,
};
