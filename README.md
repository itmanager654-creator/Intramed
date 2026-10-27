# IntraMed Solution — Next.js 14 + Tailwind (Vercel)

URLs purani site jaise hi hain: `/cardiology-devices/`, `/urology-devices/`, `/gastroenterology-devices/`, `/vascular-devices/`, `/gallery/`, `/contact/`.
Har product ka apna page hai: `/cardiology-devices/<product-name>/` (admin se product add karte hi ban jata hai, sitemap mein bhi khud aa jata hai).

## 1. Pehle ye 2 files `public/` folder mein rakhein
- `public/logo.png`  (purani site ke `assets/logo.png` se copy karein)
- `public/favicon.png`

## 2. GitHub par push (Termux)
```bash
pkg install git
cd intramed-next
git init && git add . && git commit -m "IntraMed Next.js site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main      # password ki jagah GitHub Personal Access Token dein
```
`.env.local` kabhi push na karein (.gitignore mein already hai).

## 3. Vercel par deploy
1. vercel.com par GitHub se login -> **Add New > Project** -> repo import -> Deploy.
2. Project > **Storage** > **Blob** > Create (photos ke liye). `BLOB_READ_WRITE_TOKEN` khud lag jata hai.
3. Project > **Storage** > **Marketplace > Neon (Postgres)** > Create. `DATABASE_URL` khud lag jata hai.
4. Neon console ke **SQL Editor** mein `schema.sql` ka poora content paste karke Run karein (3 tables banenge).
5. Project > **Settings > Environment Variables** mein ye add karein, phir **Redeploy**:
   - `ADMIN_PASSWORD` = apna strong password
   - `ADMIN_SECRET` = koi lambi random string
   - Notifications ke liye neeche wale variables (step 4)

Admin panel: `https://yourdomain/admin/`

## 4. Inquiry notification (phone par foran alert)
**Telegram (sabse behtar, free):**
1. Telegram mein **@BotFather** kholen > `/newbot` > naam dein > **token** copy karein -> `TELEGRAM_BOT_TOKEN`.
2. Apne naye bot ko koi bhi message bhejein (Start dabayein).
3. Browser mein kholen: `https://api.telegram.org/bot<TOKEN>/getUpdates` — `"chat":{"id": 123456789` wala number -> `TELEGRAM_CHAT_ID`.
   Kai logon ko alert chahiye to ids comma se alag karein: `111,222`.

**Email (optional):** resend.com par free account > API key -> `RESEND_API_KEY`, aur `NOTIFY_EMAIL` = jis email par alert chahiye.
Apna domain verify kar lein to `RESEND_FROM` mein `IntraMed <info@intramedsolution.com>` lagayen.

Admin dashboard khula ho to har 30 second mein naye inquiries check hote hain ("Enable browser alerts" dabayein).

## 5. Domain (CreativeOn) ko Vercel par lagana
1. Vercel > Project > **Settings > Domains** > `intramedsolution.com` aur `www.intramedsolution.com` add karein.
   `www` ko **primary** rakhein (canonical wahi hai), non-www apne aap redirect ho jayega.
2. Vercel jo DNS records dikhaye wohi use karein (aam tor par): 
   - **A record**: host `@` -> `76.76.21.21`
   - **CNAME**: host `www` -> `cname.vercel-dns.com`
3. CreativeOn ke client area > Domains > **Manage DNS / DNS Management** mein jayein.
   Purane Firebase wale A/CNAME records **delete** karein, upar wale 2 records add karein, save karein.
4. 5 minute se kuch ghantay mein Vercel mein domain par green tick aa jata hai (SSL khud ban jata hai).
5. Pehle `xxx.vercel.app` par sab kuch test karein. Purani Firebase site 1-2 hafte band na karein.

## 6. Migration ke baad SEO
- Google Search Console > Sitemaps > `https://www.intramedsolution.com/sitemap.xml` submit karein.
- 4 speciality URLs par **Request Indexing** karein.
- Purane Firebase se products admin panel mein dobara add karein (photos upload karte jayen).

## Local run
```bash
npm install
cp .env.example .env.local   # values bharein
npm run dev
```

## 7. Purane Firebase se products import (ek bar)
```bash
npm install
# .env.local mein DATABASE_URL aur BLOB_READ_WRITE_TOKEN paste karein (Vercel > Settings > Environment Variables)
npm run migrate
```
Ye Firebase se sirf **parhta** hai (kuch delete nahi karta): catalog, gallery aur purani inquiries naye system mein copy hoti hain,
aur base64 photos asli image files ban kar Vercel Blob mein jati hain. Dobara chalayen to duplicate nahi bante.
Agar "HTTP 403" aaye to Firestore rules read allow nahi kar rahi.

## 8. Update (content editor, phone notifications, About page)
1. **Neon SQL Editor** mein `schema.sql` dobara poora paste karke Run karein (safe hai, sirf 2 nayi tables banti hain: `site_content`, `push_subs`).
2. Phone push keys banayein (Termux mein, `npm install` ki zaroorat nahi):
   ```bash
   node scripts/gen-vapid.mjs
   ```
   Jo 2 lines aayen (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`) Vercel > Settings > Environment Variables mein daalein. **Redeploy** karein.
3. `/admin/` kholen > **Inquiry notifications** box:
   - **Send test** dabayein: har channel (Telegram / Phone push / Email) ka asli natija likha aayega (kya masla hai wo bhi).
   - Phone par **Enable phone notifications** dabayein aur Allow karein. Iske baad site band ho tab bhi alert aayega.
4. **Website text** tab: poori website ke headings, paragraphs, contact info, WhatsApp number, address, Google (SEO) titles yahan se badlein.
5. Optional: Google Search Console ka verification code `GOOGLE_SITE_VERIFICATION` mein daalein.
