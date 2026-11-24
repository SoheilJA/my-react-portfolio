/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useSmoothScroll } from './hooks/useSmoothScrollAndGsap';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { ContactPage } from './pages/ContactPage';
import {
  PortfolioContentProvider,
  usePortfolioContent,
} from './context/PortfolioContentContext';
import { AdminPage } from './pages/AdminPage';
import { LocalizedLink } from './components/LocalizedLink';
import { SiteLoadingEffects } from './components/SiteLoadingEffects';

function RouteEffects() {
  const { pathname } = useLocation();
  const { setLang } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/fa' || pathname.startsWith('/fa/')) {
      setLang('fa');
    } else if (pathname === '/en' || pathname.startsWith('/en/')) {
      setLang('en');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

function NotFoundPage() {
  const { lang } = useLanguage();
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-28 text-center md:px-8">
      <div className="font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
        404
      </div>
      <h1 className="mt-3 font-display text-4xl font-black text-white md:text-5xl">
        {lang === 'fa' ? 'صفحه مورد نظر یافت نشد' : 'Page Not Found'}
      </h1>
      <p className="mt-3 text-base text-[#898F9D]">
        {lang === 'fa'
          ? 'نشانی وارد شده وجود ندارد یا منتقل شده است.'
          : 'The route you requested does not exist or has moved.'}
      </p>
      <LocalizedLink
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#55FF8A] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] transition-colors"
      >
        {lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'RETURN HOME'}
      </LocalizedLink>
    </section>
  );
}

function PortfolioLayout() {
  useSmoothScroll();

  return (
    <div className="min-h-screen flex flex-col bg-[#090E19] text-white selection:bg-[#55FF8A] selection:text-black">
      <RouteEffects />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function LanguageShell() {
  const { lang } = useParams();
  if (lang !== 'fa' && lang !== 'en') return <Navigate to="/" replace />;
  return <Outlet />;
}

function HomeRedirect() {
  const { lang } = useLanguage();
  return <Navigate to={`/${lang}`} replace />;
}

function PublicContentBoundary() {
  const { error, isContentInitialized, isLoading, reload } = usePortfolioContent();
  const { lang } = useLanguage();

  if (isLoading) {
    return (
      <main
        role="status"
        className="flex min-h-screen items-center justify-center bg-[#090E19] text-white"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#55FF8A] border-t-transparent" />
      </main>
    );
  }

  if (isContentInitialized !== true) {
    const isPersian = lang === 'fa';
    const isUninitialized = isContentInitialized === false;
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#090E19] px-5 text-center text-white"
        dir={isPersian ? 'rtl' : 'ltr'}
      >
        <h1 className="text-2xl font-bold">
          {isUninitialized
            ? isPersian ? 'محتوای سایت هنوز وارد نشده است' : 'Site content has not been imported'
            : isPersian ? 'دریافت محتوای سایت ممکن نیست' : 'Site content is unavailable'}
        </h1>
        <p className="max-w-xl text-sm text-[#AEB7C8]">
          {isUninitialized
            ? isPersian
              ? 'برای نمایش سایت، فایل JSON محتوا را از پنل مدیریت وارد و ذخیره کنید.'
              : 'Import and save the site content JSON from the admin panel to display the site.'
            : error}
        </p>
        {isUninitialized ? (
          <a
            href="/admin"
            className="rounded-full bg-[#55FF8A] px-5 py-3 text-sm font-bold text-black"
          >
            {isPersian ? 'رفتن به پنل مدیریت' : 'Open admin panel'}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => void reload()}
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold"
          >
            {isPersian ? 'تلاش دوباره' : 'Try again'}
          </button>
        )}
      </main>
    );
  }

  return <Outlet />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <PortfolioContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/" element={<HomeRedirect />} />
              <Route element={<PublicContentBoundary />}>
                <Route path="/:lang" element={<LanguageShell />}>
                  <Route element={<PortfolioLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:slug" element={<ProjectDetailPage />} />
                    <Route path="certificates" element={<CertificatesPage />} />
                    <Route path="contact" element={<ContactPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route path="*" element={<HomeRedirect />} />
              </Route>
            </Routes>
            <SiteLoadingEffects />
          </BrowserRouter>
        </PortfolioContentProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
