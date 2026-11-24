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
import { PortfolioContentProvider } from './context/PortfolioContentContext';
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

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <PortfolioContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/" element={<HomeRedirect />} />
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
            </Routes>
            <SiteLoadingEffects />
          </BrowserRouter>
        </PortfolioContentProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
