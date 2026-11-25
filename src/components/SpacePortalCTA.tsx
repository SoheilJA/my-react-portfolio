import React from 'react';
import { LocalizedLink as Link } from './LocalizedLink';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolioContent } from '../context/PortfolioContentContext';

export function SpacePortalCTA() {
  const { lang, t } = useLanguage();
  const { content } = usePortfolioContent();

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#070E17] px-6 py-20 md:px-14 md:py-24 text-center shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
        {/* Background Windscribe Space Portal Artwork */}
        <img
          loading="lazy"
          decoding="async"
          src={content.assets.contactPortal}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
        />
        {/* Measured scrim for crisp 4.5:1 text contrast */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070E17]/65 via-[#070E17]/40 to-[#070E17]/75"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.08] [text-wrap:balance]">
            {t(content.pageCopy.ctaHeading)}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg text-[#C2C8D4] leading-relaxed">
            {t(content.pageCopy.ctaDescription)}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#55FF8A] px-9 py-4 text-sm font-extrabold uppercase tracking-wider text-black shadow-[0_0_32px_rgba(85,255,138,0.35)] hover:bg-[#6EFF9B] hover:-translate-y-0.5 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {lang === 'fa' ? 'شروع همکاری' : "LET'S START A PROJECT"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
