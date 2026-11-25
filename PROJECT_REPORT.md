# گزارش بررسی پروژه

## ۱. ساختار پروژه

- `src/`: برنامهٔ React، صفحات عمومی، پنل مدیریت، context، دادهٔ اولیه، ابزارها و تصاویر.
- `worker/index.ts`: Worker برای API و ارائهٔ فایل‌های buildشده.
- `migrations/`: طرح و مهاجرت D1؛ فقط یک migration موجود است.
- `public/`: favicon و تصاویر WebP نمونه‌کار/مدرک.
- `vite.config.ts`: تنظیمات Vite، پراکسی API و بارگذاری محلی تصویر.
- `wrangler.jsonc`: پیکربندی Cloudflare Worker و D1.
- `site-content-export.json`: فایل واردکردن اولیه/پشتیبان محتوای سایت.
- `dist/`: خروجی build موجود؛ تولیدی است و در ساختار منبع منظور نشده.
- `node_modules/`: وابستگی‌ها؛ درخت زیر آن را حذف کرده است.

```text
.
├── migrations/
├── public/
│   └── assets/portfolio/
├── src/
│   ├── assets/images/
│   ├── components/ui/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   └── utils/
├── worker/
├── package.json
├── site-content-export.json
├── vite.config.ts
└── wrangler.jsonc
```

- نسخه‌های اعلام‌شده در [package.json](package.json): React و React DOM `^19.0.1`، Vite `^8.3.0`، React Router DOM `^7.18.6`.
- کتابخانه‌های اصلی دیگر: Tailwind CSS `^4.3.3`، Motion `^12.23.24`، GSAP `^3.15.1`، Lenis `^1.3.28` و lucide-react `^0.546.0`.
- پنل ادمین برنامهٔ جداگانه نیست؛ مسیر `/admin` در همان برنامهٔ React است. صفحات با React Router در [src/App.tsx](src/App.tsx) تعریف شده‌اند.

## ۲. تنظیمات Cloudflare

- نوع استقرار: **Workers**، نه Pages؛ `main` به Worker اشاره دارد، دارایی‌های `dist` به آن متصل‌اند و دستور deploy برابر `wrangler deploy` است.
- فایل تنظیمات: [wrangler.jsonc](wrangler.jsonc). محتوای کامل، با حذف شناسهٔ کامل D1:

```jsonc
{
  "name": "soheil-portfolio",
  "main": "worker/index.ts",
  "compatibility_date": "2026-11-19",
  "workers_dev": true,
  "vars": {
    "SITE_ORIGIN": "https://soheil-ja.ir",
  },
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"],
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "portfolio-db",
      "database_id": "[حذف‌شده]",
      "migrations_dir": "migrations",
    },
  ],
}
```

- بایندینگ D1 با نام `DB`؛ Worker فایل‌های build را از `ASSETS` تحویل می‌دهد.
- Worker موجود است: [worker/index.ts](worker/index.ts). پوشهٔ Pages `functions/` **وجود ندارد**.
- `ADMIN_PASSWORD` و `SESSION_SECRET` در فایل‌های نمونهٔ محیط به‌صورت placeholder هستند؛ تنظیم secretهای واقعی محیط تولید از این فایل‌ها قابل‌تأیید نیست.

## ۳. دیتابیس D1

- طرح تنها در [migrations/0001_site_content.sql](migrations/0001_site_content.sql) تعریف شده: جدول `site_content` با ستون‌های `id INTEGER` (کلید اصلی و محدود به مقدار ۱)، `document TEXT NOT NULL` و `updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`.
- جدول‌های دیگر یا migrationهای دیگر **وجود ندارد**.
- تمام دادهٔ محتوایی در یک سند JSON در `document` ذخیره می‌شود؛ ساختار آن: `profile`, `pageCopy`, `projects`, `services`, `experience`, `certificates`, `skills`, `paths`, `stats`, `technologies`, `assets`.
- محتوای اولیهٔ دوزبانه و داده‌های فعلی در [src/data/portfolioData.ts](src/data/portfolioData.ts:82) تعریف شده و نسخهٔ قابل‌واردکردن در [site-content-export.json](site-content-export.json) است. برنامه خودکار seed نمی‌کند؛ README می‌گوید هنگام خالی بودن D1 باید JSON از پنل وارد و ذخیره شود.
- این کلیدهای محتوایی از ساختار پیش‌فرض قابل‌ویرایش/ذخیره در D1 هستند: مشخصات و راه‌های ارتباطی `profile`؛ داده‌های پروژه، خدمت، سابقه، مدرک، مهارت، مسیر تخصصی، آمار، فناوری و آدرس تصاویر؛ متن‌های `pageCopy`: `homeHeroHeading`, `homeHeroAccent`, `homeHeroSuffix`, `homeHeroDescription`, `homePathsHeading`, `homePathsDescription`, `homeCloudHeading`, `homeCloudDescription`, `homeDirectHeading`, `homeDirectDescription`, `homeServicesHeading`, `homeServicesDescription`, `homeProjectsHeading`, `homeProjectsDescription`, `homeStackHeading`, `homeStackDescription`, `homeExperienceHeading`, `homeExperienceDescription`, `homeCertificatesHeading`, `homeCertificatesDescription`, `aboutHeroHeading`, `aboutSkillsHeading`, `aboutSkillsDescription`, `aboutExperienceHeading`, `aboutCertificatesHeading`, `aboutCertificatesDescription`, `aboutBeyondHeading`, `aboutBeyondDescription`, `servicesHeading`, `servicesDescription`, `projectsHeading`, `projectsDescription`, `certificatesHeading`, `certificatesDescription`, `contactHeading`, `contactDescription`, `ctaHeading`, `ctaDescription`.
- هر دو زبانِ این محتوا و فیلدهای پروفایل در قالب اولیه وجود دارند. این‌ها به‌عنوان داده در زمان اجرا از D1 خوانده می‌شوند، اما تعریف و مقادیر اولیه‌شان همچنان در `portfolioData.ts` و فایل export هم وجود دارد.
- متن‌هایی که هنوز در رابط کد ثابت هستند و در ویرایشگر محتوای D1 فیلد ندارند: نام‌های ناوبری و فوتر در [src/components/Navbar.tsx](src/components/Navbar.tsx:26) و [src/components/Footer.tsx](src/components/Footer.tsx:17)، متن صفحهٔ 404 در [src/App.tsx](src/App.tsx:64)، برچسب/راهنمای جست‌وجو و فیلتر پروژه در [src/pages/ProjectsPage.tsx](src/pages/ProjectsPage.tsx:54)، و برچسب‌ها و پیام‌های فرم تماس در [src/pages/ContactPage.tsx](src/pages/ContactPage.tsx:106). فرم تماس در کد فقط اعتبارسنجی/نمایش نتیجه و بازکردن ایمیل را انجام می‌دهد؛ ارسال سروری در API **وجود ندارد**.

## ۴. API

همهٔ مسیرها در [worker/index.ts](worker/index.ts:161) پیاده‌سازی شده‌اند:

| مسیر و متد | کارکرد | محافظت |
|---|---|---|
| `GET /api/content` | خواندن سند عمومی سایت از D1 | بدون ورود؛ محتوای سایت عمومی است |
| `GET /api/auth/session` | بررسی اعتبار نشست مدیر | نیازمند ورود نیست؛ فقط وضعیت را می‌دهد |
| `POST /api/auth/login` | بررسی رمز مدیر و ساخت cookie نشست | کنترل Origin در صورت ارسال هدر؛ secretهای تنظیم‌شده لازم‌اند |
| `POST /api/auth/logout` | پاک‌کردن cookie نشست | نیازمند ورود نیست؛ کنترل Origin در صورت ارسال هدر |
| `PUT /api/content` | اعتبارسنجی و ذخیرهٔ JSON در D1 | کنترل Origin در صورت ارسال هدر و نشست معتبر لازم است |
| `POST /api/uploads` | در Worker تولید **وجود ندارد**؛ فقط در Vite محلی تعریف شده | middleware توسعه فقط loopback را می‌پذیرد |
| سایر `/api/*`ها | پاسخ 404 | — |

- احراز هویت با `ADMIN_PASSWORD` و cookie امضاشدهٔ HMAC-SHA256، `HttpOnly`, `SameSite=Strict` و عمر ۷ روز است؛ `Secure` در HTTPS اضافه می‌شود. پیکربندی secretهای واقعی در محیط production قابل مشاهده/تأیید نیست.
- مسیر نوشتن محتوای production (`PUT /api/content`) محافظت از سمت Worker دارد؛ اتصال SQL از prepared statement و bind استفاده می‌کند.
- CORS مجازکننده در Worker **وجود ندارد**. کنترل Origin ردکردن Origin خارجی را پوشش می‌دهد، اما درخواست فاقد هدر Origin را مجاز می‌داند.

## ۵. پنل ادمین

- پنل در [src/pages/AdminPage.tsx](src/pages/AdminPage.tsx:32) است؛ ورود، خروج، ویرایش JSON ساختاری، ذخیره، و واردکردن JSON اولیه را دارد. واردکردن فایل از مسیر حالت D1 خالی ارائه می‌شود.
- بخش‌های قابل ویرایش: پروفایل؛ متن صفحات؛ پروژه‌ها؛ خدمات؛ سوابق کاری؛ گواهی‌نامه‌ها؛ مهارت‌ها؛ مسیرهای تخصصی؛ آمار صفحهٔ اصلی؛ فناوری‌ها؛ تصاویر سایت.
- برای پروژه و مدرک، فیلد نشانی تصویر و پیش‌نمایش وجود دارد. بارگذاری فایل از خود پنل فقط روی `localhost` در دسترس است؛ در پنل آنلاین باید URL وارد شود.
- متن رابط پنل، ناوبری، فرم تماس و خطای 404 از بخش‌های محتوایی قابل‌ویرایش نیستند؛ مسیرها/ساختار صفحات نیز از پنل تغییر نمی‌کنند.

## ۶. تصاویر

- تصاویر فعلی نمونه‌کار و گواهی‌ها در `public/assets/portfolio/` و آثار پس‌زمینه در `src/assets/images/` هستند؛ بخشی از پس‌زمینه‌ها JPG است. URLها در سند D1 ذخیره می‌شوند، نه دادهٔ باینری/base64. URL خارجی هم به‌عنوان مقدار فیلد قابل ثبت است.
- R2 یا بایندینگ ذخیره‌سازی تصویر **وجود ندارد**. آپلود محلی تصویر را در `public/images/portfolio/` می‌نویسد؛ برای انتشار فایل تازه، build و deploy مجدد لازم است.
- تبدیل سمت مرورگر به WebP وجود دارد: [src/utils/imageCompression.ts](src/utils/imageCompression.ts:1) از Canvas استفاده می‌کند؛ فایل ورودی حداکثر ۲۰ MB، ضلع بزرگ حداکثر ۲۵۶۰ px (کاهش تدریجی تا ۱۲۸۰ px)، کیفیت 0.78–0.92 و هدف حدود ۱.۵ MB. فایل WebP محلی روی سرور توسعه سقف ۸ MB دارد.
- محدودیت «حدود ۵۰ عکس» در کد **وجود ندارد**. تبدیل پیش از ارسال اجرا می‌شود، اما بارگذاریِ server-side فقط توسعهٔ محلی است و هر تصویر جدید نیازمند استقرار مجدد است. محتوای JSON نیز حداکثر ۱ MB است؛ بنابراین هدف ۱.۵ MB به‌ازای هر تصویر، محدودیت ذخیره‌سازی خود تصویر نیست چون فقط URL در D1 می‌رود.
- روی `<img>`های پیدا‌شده در صفحات، `loading="lazy"` **وجود ندارد**؛ lazy loading پیاده‌سازی نشده است. فشرده‌سازی/تغییر اندازهٔ عمومی برای همهٔ تصاویر در build **وجود ندارد**؛ تنها مسیر آپلود ادمین WebP را تبدیل و resize می‌کند.

## ۷. مشکلات و ریسک‌ها

- **مصرف D1:** `PortfolioContentProvider` با mount برنامه `GET /api/content` می‌زند ([src/context/PortfolioContentContext.tsx](src/context/PortfolioContentContext.tsx:49)). Worker پاسخ را `no-store` می‌کند ([worker/index.ts](worker/index.ts:27))؛ CDN/browser cache برای این پاسخ تنظیم نشده، پس بارگذاری کامل مجدد سایت یک خواندن D1 دارد. تغییر مسیر در SPA به‌تنهایی provider را دوباره mount نمی‌کند.
- **بارگذاری تصویر آنلاین:** route تولیدی `/api/uploads` وجود ندارد؛ امکان ارسال تصویر از پنل ادمین آنلاین فعلاً نیست. ذخیرهٔ تصویر جدید نیازمند توسعهٔ محلی و انتشار مجدد است.
- **امنیت نشست:** برای login محدودسازی تعداد تلاش/نرخ درخواست در کد **وجود ندارد**. Origin غایب رد نمی‌شود؛ هرچند cookie `SameSite=Strict` است. مقدار secret واقعی و secretهای استقرار بررسی‌پذیر نیستند.
- **SQL injection:** در مسیرهای بررسی‌شده، کوئری‌ها مقدار داده را bind می‌کنند؛ شاهدی از الحاق ورودی به SQL پیدا نشد.
- **اعتبارسنجی ساختار:** Worker الزام می‌کند چند آرایه/بخش اصلی وجود داشته باشند؛ اعتبارسنجی schema عمیق همهٔ فیلدها **وجود ندارد**. سقف سند ورودی/ذخیره ۱ MB هست.
- **سهمیه/بار تصاویر:** هر تصویر استاتیک به deployment asset اضافه می‌شود؛ تعداد تصویر محدود نشده و lazy loading ندارد. فهرست تصاویر ۵۰تایی یا سیاست نگهداری/پاک‌سازی فایل **وجود ندارد**.
- **کلید لو‌رفته:** در فایل‌های بررسی‌شده مقدار credential واقعی پیدا نشد؛ فایل `.dev.vars.example` placeholder دارد. `database_id` در تنظیمات موجود است، اما در این گزارش کامل درج نشده؛ شناسهٔ D1 به‌تنهایی secret احراز هویت نیست.
- **CORS:** تنظیم CORS عمومی **وجود ندارد**؛ API هم‌مبدأ است و برای login/write کنترل Origin دارد، با این استثنا که هدر غایب رد نمی‌شود.

## ۸. فهرست فایل‌های مهم

- [package.json](package.json:6) — نسخه‌ها، وابستگی‌ها و دستورهای اجرا/build/deploy/migration.
- [wrangler.jsonc](wrangler.jsonc:1) — پیکربندی Worker، D1 و assets.
- [worker/index.ts](worker/index.ts:161) — API محتوا و احراز هویت.
- [migrations/0001_site_content.sql](migrations/0001_site_content.sql:1) — ساخت جدول D1.
- [src/App.tsx](src/App.tsx:169) — routeهای سایت و `/admin`.
- [src/pages/AdminPage.tsx](src/pages/AdminPage.tsx:727) — پنل ادمین، ویرایش، import و ذخیره.
- [src/context/PortfolioContentContext.tsx](src/context/PortfolioContentContext.tsx:41) — خواندن محتوای D1 در اجرای برنامه.
- [src/data/portfolioData.ts](src/data/portfolioData.ts:923) — نوع سند، دادهٔ پیش‌فرض و متن‌های `pageCopy`.
- [site-content-export.json](site-content-export.json:1) — سند JSON برای import/پشتیبان.
- [src/utils/imageCompression.ts](src/utils/imageCompression.ts:28) — تبدیل/resize WebP در مرورگر.
- [vite.config.ts](vite.config.ts:1) — پراکسی API و endpoint آپلود محدود به توسعهٔ محلی.
- [src/pages/ContactPage.tsx](src/pages/ContactPage.tsx:58) — فرم تماس؛ endpoint ارسال پیام ندارد.
- [README.md](README.md:1) — راهنمای اجرای محلی، مهاجرت و انتشار Cloudflare.
