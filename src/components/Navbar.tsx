import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogoMark } from './WindscribeArtwork';
import { LocalizedLink as Link, LocalizedNavLink as NavLink } from './LocalizedLink';

export function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const switchLanguage = () => {
    const nextLanguage = lang === 'fa' ? 'en' : 'fa';
    const localizedPath = location.pathname.replace(/^\/(fa|en)(?=\/|$)/, `/${nextLanguage}`);
    toggleLang();
    navigate(localizedPath || `/${nextLanguage}`);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/about', label: lang === 'fa' ? 'درباره من' : 'About' },
    { to: '/services', label: lang === 'fa' ? 'خدمات' : 'Services' },
    { to: '/projects', label: lang === 'fa' ? 'نمونه‌کارها' : 'Projects' },
    { to: '/certificates', label: lang === 'fa' ? 'مدارک' : 'Certificates' },
    { to: '/contact', label: lang === 'fa' ? 'تماس' : 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090E19]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-5 py-3.5 md:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#55FF8A] rounded-md"
        >
          <BrandLogoMark className="w-7 h-7" />
          <span className="font-display text-lg md:text-xl font-extrabold tracking-tight">
            {lang === 'fa' ? 'سهیل احمدی' : 'soheil'}
          </span>
        </Link>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label={lang === 'fa' ? 'منوی اصلی' : 'Main navigation'}
          className="hidden md:flex items-center gap-6 lg:gap-8"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-[#55FF8A] border-[#55FF8A]'
                    : 'text-[#C2C8D4] border-transparent hover:text-white hover:border-white/30'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Language switch + Windscribe bright green CTA */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={switchLanguage}
            aria-label={
              lang === 'fa' ? 'Switch language to English' : 'تغییر زبان به فارسی'
            }
            className="text-sm font-semibold text-[#C2C8D4] hover:text-white transition-colors px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#55FF8A] rounded"
          >
            {lang === 'fa' ? 'EN' : 'FA'}
          </button>
          <Link
            to="/contact"
            className="rounded-full bg-[#55FF8A] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {lang === 'fa' ? 'همکاری با من' : 'Hire Me'}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={switchLanguage}
            aria-label={
              lang === 'fa' ? 'Switch language to English' : 'تغییر زبان به فارسی'
            }
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm font-bold text-white border border-white/15 rounded-lg px-3 cursor-pointer"
          >
            {lang === 'fa' ? 'EN' : 'FA'}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={lang === 'fa' ? 'باز کردن منو' : 'Toggle navigation menu'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-white/15 bg-[#0B0F16] text-white cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070E17] px-5 py-5 space-y-2">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `min-h-[44px] flex items-center px-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#55FF8A]/10 text-[#55FF8A]'
                      : 'text-[#C2C8D4] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10">
            <Link
              to="/contact"
              className="flex w-full min-h-[44px] items-center justify-center rounded-full bg-[#55FF8A] px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-black"
            >
              {lang === 'fa' ? 'همکاری با من' : 'Hire Me'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
