import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogoMark } from './WindscribeArtwork';
import { LocalizedLink as Link } from './LocalizedLink';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import { sortProjectsByNewest } from '../utils/portfolioLogic';

export function Footer() {
  const { lang, setLang, t } = useLanguage();
  const { content } = usePortfolioContent();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile: PORTFOLIO_PROFILE, projects: PORTFOLIO_PROJECTS, services: PORTFOLIO_SERVICES } = content;

  const pages = [
    { to: '/', label: lang === 'fa' ? 'خانه' : 'Home' },
    { to: '/about', label: lang === 'fa' ? 'درباره من' : 'About' },
    { to: '/services', label: lang === 'fa' ? 'خدمات' : 'Services' },
    { to: '/projects', label: lang === 'fa' ? 'نمونه‌کارها' : 'Projects' },
    { to: '/certificates', label: lang === 'fa' ? 'مدارک و گواهی‌نامه‌ها' : 'Certificates' },
    { to: '/contact', label: lang === 'fa' ? 'تماس و شروع همکاری' : 'Contact' },
  ];

  const featuredProjects = sortProjectsByNewest(PORTFOLIO_PROJECTS).slice(0, 6);

  const changeLanguage = (next: 'en' | 'fa') => {
    setLang(next);
    navigate(location.pathname.replace(/^\/(fa|en)(?=\/|$)/, `/${next}`));
  };

  return (
    <footer className="border-t border-white/10 bg-[#070E17] text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Pages */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              {lang === 'fa' ? 'صفحات' : 'Navigation'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#898F9D]">
              {pages.map((p) => (
                <li key={p.to}>
                  <Link
                    to={p.to}
                    className="hover:text-[#55FF8A] transition-colors inline-block py-0.5"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              {lang === 'fa' ? 'خدمات' : 'Services'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#898F9D]">
              {PORTFOLIO_SERVICES.map((svc) => (
                <li key={svc.id}>
                  <Link
                    to={`/contact?service=${svc.slug}`}
                    className="hover:text-[#55FF8A] transition-colors inline-block py-0.5"
                  >
                    {t(svc.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Selected Works */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              {lang === 'fa' ? 'پروژه‌های منتخب' : 'Selected Projects'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#898F9D]">
              {featuredProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="hover:text-[#55FF8A] transition-colors inline-block py-0.5"
                  >
                    {t(project.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Brand, Direct Contact & Language Switcher (Windscribe Footer Pattern) */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5">
                <BrandLogoMark className="w-7 h-7" />
                <span className="font-display text-xl font-extrabold tracking-tight text-white">
                  {t(PORTFOLIO_PROFILE.name)}
                </span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-[#898F9D]">
                {t(PORTFOLIO_PROFILE.extraCraft)}
              </p>

              <div className="mt-5 space-y-2.5 text-sm text-[#C2C8D4]">
                <a
                  href={`tel:${PORTFOLIO_PROFILE.phone}`}
                  dir="ltr"
                  className="flex items-center gap-2.5 hover:text-[#55FF8A] transition-colors w-fit"
                >
                  <Phone className="w-4 h-4 text-[#55FF8A] shrink-0" />
                  <span className="font-mono-tech">{PORTFOLIO_PROFILE.phone}</span>
                </a>
                <a
                  href={`mailto:${PORTFOLIO_PROFILE.email}`}
                  dir="ltr"
                  className="flex items-center gap-2.5 hover:text-[#55FF8A] transition-colors w-fit break-all"
                >
                  <Mail className="w-4 h-4 text-[#55FF8A] shrink-0" />
                  <span className="text-xs font-mono-tech">{PORTFOLIO_PROFILE.email}</span>
                </a>
                <div className="flex items-center gap-2.5 text-[#898F9D]">
                  <MapPin className="w-4 h-4 text-[#55FF8A] shrink-0" />
                  <span>{t(PORTFOLIO_PROFILE.location)}</span>
                </div>
              </div>
            </div>

            {/* Windscribe-style footer language switcher */}
            <div>
              <div className="text-xs font-medium text-[#898F9D] mb-2">
                {lang === 'fa' ? 'تغییر زبان:' : 'Switch Language:'}
              </div>
              <div className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-[#0B0F16] p-1">
                <Globe className="w-4 h-4 text-[#55FF8A] mx-2 shrink-0" />
                <button
                  type="button"
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'en'
                      ? 'bg-[#55FF8A] text-black'
                      : 'text-[#898F9D] hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('fa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'fa'
                      ? 'bg-[#55FF8A] text-black'
                      : 'text-[#898F9D] hover:text-white'
                  }`}
                >
                  فارسی
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#898F9D]">
          <div>
            {lang === 'fa'
              ? '© ۲۰۲۶ سهیل جلال‌احمدی. تمامی حقوق محفوظ است.'
              : '© 2026 Soheil Jalal-Ahmadi. All rights reserved.'}
          </div>
          <div className="font-mono-tech text-[#898F9D]">
            {lang === 'fa' ? 'مشهد · ایران — آماده همکاری' : 'MASHHAD · IRAN — AVAILABLE FOR WORK'}
          </div>
        </div>
      </div>
    </footer>
  );
}
