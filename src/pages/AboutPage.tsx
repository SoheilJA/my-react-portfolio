import React from 'react';
import { LocalizedLink as Link } from '../components/LocalizedLink';
import { CheckCircle2, Film, Camera, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  usePortfolioContent,
} from '../context/PortfolioContentContext';
import { FourPointStarField } from '../components/WindscribeArtwork';
import { SpacePortalCTA } from '../components/SpacePortalCTA';

export function AboutPage() {
  const { lang, isRtl, t } = useLanguage();
  const { content } = usePortfolioContent();
  const {
    assets: ARTWORK_ASSETS,
    certificates: PORTFOLIO_CERTIFICATES,
    experience: PORTFOLIO_EXPERIENCE,
    profile: PORTFOLIO_PROFILE,
    skills: PORTFOLIO_SKILLS,
  } = content;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#090E19]">
      {/* Editorial Windscribe Hero Composition */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/10">
        <FourPointStarField />
        <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t(PORTFOLIO_PROFILE.location)}</span>
                <span aria-hidden="true">·</span>
                <span>{t(PORTFOLIO_PROFILE.availability)}</span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06] [text-wrap:balance]">
                {t(content.pageCopy.aboutHeroHeading)}
              </h1>

              <p className="mt-6 text-base md:text-lg leading-relaxed text-[#C2C8D4]">
                {t(PORTFOLIO_PROFILE.bio)}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] transition-all whitespace-nowrap"
                >
                  <span>{lang === 'fa' ? 'مشاهده نمونه‌کارها' : 'EXPLORE PROJECTS'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
                <Link
                  to="/certificates"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0B0F16] px-6 py-3.5 text-xs font-bold text-white hover:border-[#55FF8A] hover:text-[#55FF8A] transition-colors whitespace-nowrap"
                >
                  <span>{lang === 'fa' ? 'مدارک و گواهی‌نامه‌ها' : 'View Certificates'}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border-2 border-[#02050A] bg-[#070E17] overflow-hidden ring-1 ring-[#55FF8A]/35 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={ARTWORK_ASSETS.aboutAtelier}
                  alt={
                    lang === 'fa'
                      ? 'تصویرسازی استودیوی دیجیتال سهیل جلال‌احمدی'
                      : 'Cosmic digital workstation artwork representing Soheil Jalal-Ahmadi'
                  }
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Matrix (Grouped Technical Labels — Zero Progress Bars) */}
      <section className="bg-[#070E17] py-20 border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-black text-white">
              {t(content.pageCopy.aboutSkillsHeading)}
            </h2>
            <p className="mt-3 text-base text-[#898F9D]">
              {t(content.pageCopy.aboutSkillsDescription)}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PORTFOLIO_SKILLS.map((group, idx) => (
              <div
                key={group.id}
                className="rounded-2xl border border-white/12 bg-[#0B0F16] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono-tech text-xs text-[#55FF8A]">0{idx + 1}</div>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">
                    {t(group.title)}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-between border-b border-white/8 pb-2 text-sm text-[#C2C8D4] last:border-b-0 last:pb-0"
                      >
                        <span className="font-medium">{item}</span>
                        <span className="w-1.5 h-1.5 rounded-xs bg-[#55FF8A]" aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Experience & Education */}
      <section className="bg-[#090E19] py-20 border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl md:text-4xl font-black text-white">
                {t(content.pageCopy.aboutExperienceHeading)}
              </h2>
              <div className="mt-8 space-y-6">
                {PORTFOLIO_EXPERIENCE.map((exp) => (
                  <article
                    key={exp.id}
                    className="rounded-2xl border border-white/12 bg-[#0B0F16] p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono-tech text-xs text-[#55FF8A]">
                        {exp.period}
                      </span>
                      <span className="text-xs font-semibold text-[#898F9D]">
                        {t(exp.tag)} · {t(exp.milestone)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-extrabold text-white">
                      {t(exp.company)} —{' '}
                      <span className="text-[#C2C8D4] font-semibold text-lg">
                        {t(exp.role)}
                      </span>
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-[#898F9D]">
                      {exp.points[lang].map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#55FF8A] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-white/8 font-mono-tech text-xs text-[#55FF8A]">
                      {exp.stack}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Education, Certificates & Creative Disciplines */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-white/12 bg-[#0B0F16] p-6">
                <h2 className="font-display text-2xl font-bold text-white">
                  {t(content.pageCopy.aboutCertificatesHeading)}
                </h2>
                <p className="mt-2 text-sm text-[#898F9D]">
                  {t(content.pageCopy.aboutCertificatesDescription)}
                </p>
                <div className="mt-5 space-y-3">
                  {PORTFOLIO_CERTIFICATES.map((cert) => (
                    <a
                      key={cert.id}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-white/10 bg-[#070E17] p-4 hover:border-[#55FF8A]/50 transition-colors"
                    >
                      <div className="font-mono-tech text-[11px] text-[#55FF8A]">
                        {t(cert.issuer)}
                      </div>
                      <div className="mt-1 font-display text-base font-bold text-white">
                        {t(cert.title)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/12 bg-[#0B0F16] p-6">
                <h2 className="font-display text-2xl font-bold text-white">
                  {t(content.pageCopy.aboutBeyondHeading)}
                </h2>
                <p className="mt-2.5 text-sm text-[#898F9D] leading-relaxed">
                  {t(content.pageCopy.aboutBeyondDescription)}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#070E17] p-4">
                    <Film className="w-5 h-5 text-[#55FF8A]" />
                    <div className="mt-2 text-sm font-bold text-white">
                      {lang === 'fa' ? 'سینما و تصویربرداری' : 'Cinema & Video'}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#070E17] p-4">
                    <Camera className="w-5 h-5 text-[#55FF8A]" />
                    <div className="mt-2 text-sm font-bold text-white">
                      {lang === 'fa' ? 'عکاسی و گرافیک' : 'Photography & Design'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SpacePortalCTA />
    </div>
  );
}
