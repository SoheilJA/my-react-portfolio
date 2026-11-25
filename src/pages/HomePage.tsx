import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { LocalizedLink as Link } from '../components/LocalizedLink';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import { PortfolioProject } from '../data/portfolioData';
import { formatStatValue, sortProjectsByNewest } from '../utils/portfolioLogic';
import { ProjectPreviewDialog } from '../components/ProjectPreviewDialog';
import {
  FourPointStarField,
  InteractiveHeroConsole,
  PathBannerMascot,
  ProjectVisualFrame,
  ServiceBentoArt,
} from '../components/WindscribeArtwork';
import { SpacePortalCTA } from '../components/SpacePortalCTA';

export function HomePage() {
  const { lang, isRtl, t } = useLanguage();
  const { content } = usePortfolioContent();
  const {
    assets: ARTWORK_ASSETS,
    certificates: PORTFOLIO_CERTIFICATES,
    experience: PORTFOLIO_EXPERIENCE,
    paths: PORTFOLIO_PATHS,
    profile: PORTFOLIO_PROFILE,
    projects: PORTFOLIO_PROJECTS,
    services: PORTFOLIO_SERVICES,
    stats: PORTFOLIO_STATS,
    technologies: PORTFOLIO_TECHNOLOGIES,
    pageCopy,
  } = content;
  const [activeExpId, setActiveExpId] = useState<number>(1);
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  const counts = {
    projects: PORTFOLIO_PROJECTS.length,
    certificates: PORTFOLIO_CERTIFICATES.length,
    services: PORTFOLIO_SERVICES.length,
  };

  const marqueeRowOne = [...PORTFOLIO_TECHNOLOGIES, ...PORTFOLIO_TECHNOLOGIES];
  const marqueeRowTwo = [
    ...PORTFOLIO_TECHNOLOGIES.slice().reverse(),
    ...PORTFOLIO_TECHNOLOGIES.slice().reverse(),
  ];
  const latestProjects = sortProjectsByNewest(PORTFOLIO_PROJECTS).slice(0, 4);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="relative overflow-x-clip">
      {/* 1. WINDSCRIBE-STYLE SPACE HERO */}
      <section className="relative min-h-[760px] flex flex-col justify-between pt-14 pb-16 md:pt-20 md:pb-20 overflow-hidden bg-[#090E19]">
        {/* Generated Space Planets & Perspective Horizon Grid Artwork */}
        <img
          src={ARTWORK_ASSETS.heroSpace}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-95"
        />
        {/* Contrast scrim keeping central copy razor sharp while showing flanking planets */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,14,25,0.72)_0%,rgba(9,14,25,0.35)_58%,rgba(7,14,23,0.85)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-8 text-center">
          {/* Clean unboxed Windscribe announcement / identity kicker */}
          <p className="mx-auto flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs md:text-sm font-mono-tech uppercase tracking-widest text-[#C2C8D4]">
            <span className="text-[#55FF8A] font-semibold whitespace-nowrap">
              {t(PORTFOLIO_PROFILE.name)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">{t(PORTFOLIO_PROFILE.role)}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline whitespace-nowrap">{t(PORTFOLIO_PROFILE.location)}</span>
          </p>

          {/* Expressive Windscribe Display Headline */}
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-[68px] leading-[1.04] [text-wrap:balance]">
            {t(pageCopy.homeHeroHeading)}{' '}
            <span className="font-editorial-italic text-[#55FF8A]">
              {t(pageCopy.homeHeroAccent)}
            </span>
            {t(pageCopy.homeHeroSuffix)}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-[#C2C8D4] leading-relaxed">
            {t(pageCopy.homeHeroDescription)}
          </p>

          {/* Windscribe CTA Pair */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#55FF8A] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-black shadow-[0_0_32px_rgba(85,255,138,0.35)] hover:bg-[#6EFF9B] hover:-translate-y-0.5 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>{lang === 'fa' ? 'مشاهده نمونه‌کارها' : 'EXPLORE MY WORK'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#55FF8A]/35 bg-[#0E2427]/85 px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#55FF8A] hover:bg-[#133236] hover:border-[#55FF8A] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55FF8A]"
            >
              <span>{lang === 'fa' ? 'بیایید صحبت کنیم' : "LET'S TALK"}</span>
            </Link>
          </div>

          {/* Centerpiece Interactive Developer Console sitting on the glowing grid */}
          <div className="mt-12 md:mt-14">
            <InteractiveHeroConsole lang={lang} />
          </div>
        </div>
      </section>

      {/* 2. PROOF / STATS STRIP (Windscribe Reviews/Ratings Band Equivalent) */}
      <section className="border-y border-white/10 bg-[#070E17] py-10">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {PORTFOLIO_STATS.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="font-russo text-3xl md:text-4xl text-white tabular-nums tracking-tight">
                  {formatStatValue(stat, counts, lang)}
                </div>
                <div className="mt-1.5 text-xs md:text-sm font-medium text-[#898F9D]">
                  {t(stat.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY WORK WITH ME — 4-COLUMN STRIP + DUAL-MASCOT BANNER (Windscribe "Why Windscribe" Pattern) */}
      <section className="relative bg-[#090E19] py-20 md:py-28 overflow-hidden">
        <FourPointStarField />
        <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
              {t(pageCopy.homePathsHeading)}
            </h2>
            <p className="mt-4 text-base text-[#898F9D] leading-relaxed">
              {t(pageCopy.homePathsDescription)}
            </p>
          </div>

          {/* 4-Column Hairline-Separated Feature Pillars */}
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
            {PORTFOLIO_PATHS.map((path, idx) => (
              <div
                key={path.id}
                className="flex flex-col items-center text-center px-4 lg:px-7"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0B222A] border border-[#55FF8A]/35 flex items-center justify-center font-mono-tech text-sm font-bold text-[#55FF8A]">
                  0{idx + 1}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  {t(path.title)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#898F9D]">
                  {t(path.text)}
                </p>
                <div className="mt-4 font-mono-tech text-xs text-[#55FF8A]/90">
                  {path.stack}
                </div>
              </div>
            ))}

            {/* 4th Column: Cloud & Full Delivery Pillar */}
            <div className="flex flex-col items-center text-center px-4 lg:px-7">
              <div className="w-12 h-12 rounded-xl bg-[#0B222A] border border-[#55FF8A]/35 flex items-center justify-center font-mono-tech text-sm font-bold text-[#55FF8A]">
                04
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-white">
                {t(pageCopy.homeCloudHeading)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#898F9D]">
                {t(pageCopy.homeCloudDescription)}
              </p>
              <div className="mt-4 font-mono-tech text-xs text-[#55FF8A]/90">
                Docker · Kubernetes · Runflare
              </div>
            </div>
          </div>

          {/* Windscribe-style Wide Dual-Mascot Callout Card */}
          <div className="mt-14 rounded-2xl border border-white/12 bg-[#0B0F16] px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <PathBannerMascot side="left" />
            <div className="text-center max-w-xl">
              <h3 className="font-display text-2xl font-extrabold text-white">
                {t(pageCopy.homeDirectHeading)}
              </h3>
              <p className="mt-2.5 text-sm md:text-base text-[#898F9D] leading-relaxed">
                {t(pageCopy.homeDirectDescription)}
              </p>
              <div className="mt-4">
                <Link
                  to="/about"
                  className="text-sm font-bold text-[#55FF8A] underline underline-offset-4 hover:text-white transition-colors"
                >
                  {lang === 'fa' ? 'بیشتر درباره من و مسیر کاری‌ام بخوانید' : 'Read my full story & stack →'}
                </Link>
              </div>
            </div>
            <PathBannerMascot side="right" />
          </div>
        </div>
      </section>

      {/* 4. SERVICES & SOLUTIONS BENTO GRID (Windscribe "Solution to All Your Problems" Pattern) */}
      <section className="relative bg-[#070E17] py-20 md:py-28 border-t border-white/10 overflow-hidden">
        <img
          loading="lazy"
          decoding="async"
          src={ARTWORK_ASSETS.servicesGeometric}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070E17] via-[#070E17]/80 to-[#070E17]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
                {t(pageCopy.homeServicesHeading)}
              </h2>
              <p className="mt-3 max-w-xl text-base text-[#898F9D]">
                {t(pageCopy.homeServicesDescription)}
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] transition-all whitespace-nowrap self-start md:self-auto"
            >
              <span>{lang === 'fa' ? 'همه خدمات' : 'VIEW ALL SERVICES'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Asymmetric Bento Cards matching Windscribe's illustrated feature cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-6">
            {PORTFOLIO_SERVICES.map((svc, index) => {
              const colSpan = index < 2 ? 'md:col-span-3' : 'md:col-span-2';
              return (
                <article
                  key={svc.id}
                  className={`${colSpan} group flex flex-col justify-between rounded-2xl border border-white/12 bg-[#0B0F16]/95 p-6 md:p-7 hover:border-[#55FF8A]/45 transition-colors`}
                >
                  <div>
                    <div className="font-mono-tech text-xs text-[#55FF8A]">
                      {svc.stack.join(' · ')}
                    </div>
                    <h3 className="mt-2 font-display text-xl md:text-2xl font-bold text-white leading-snug">
                      {t(svc.title)}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#898F9D] leading-relaxed">
                      {t(svc.desc)}
                    </p>
                  </div>

                  <div className="mt-6 rounded-xl bg-[#070E17] border border-white/8 p-3 overflow-hidden">
                    <ServiceBentoArt variant={svc.artVariant} />
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-2">
                    <Link
                      to={`/contact?service=${svc.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#102928] px-4 py-2 text-xs font-bold text-[#55FF8A] hover:bg-[#55FF8A] hover:text-black transition-colors whitespace-nowrap"
                    >
                      <span>{lang === 'fa' ? 'درخواست خدمت' : 'Request Service'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. LATEST PROJECTS */}
      <section className="bg-[#090E19] py-20 md:py-28 border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#55FF8A]">
                {lang === 'fa' ? 'آخرین به‌روزرسانی‌ها' : 'LATEST SHIPMENTS'}
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
                {lang === 'fa' ? 'تازه‌ترین نمونه‌کارها' : 'Latest projects'}
              </h2>
              <p className="mt-3 max-w-xl text-base text-[#898F9D]">
                {lang === 'fa'
                  ? 'جدیدترین پروژه‌های اضافه‌شده، از همهٔ دسته‌بندی‌ها.'
                  : 'The newest additions across every project category.'}
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#55FF8A]/35 px-5 py-3 text-xs font-bold text-[#55FF8A] transition-colors hover:bg-[#55FF8A] hover:text-black md:self-auto"
            >
              <span>{lang === 'fa' ? 'همهٔ نمونه‌کارها' : 'ALL PROJECTS'}</span>
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {latestProjects.map((project) => (
              <article key={project.id} className="project-card group min-w-0">
                <div className="project-card__content h-full p-4">
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    aria-label={
                      lang === 'fa'
                        ? `مشاهدهٔ جزئیات ${t(project.title)}`
                        : `View ${t(project.title)} project details`
                    }
                    className="project-card__open block w-full text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                  >
                    <ProjectVisualFrame project={project} lang={lang} compact />
                    <h3 className="mt-2 font-display text-lg font-bold text-white transition-colors group-hover:text-[#55FF8A]">
                      {t(project.title)}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#898F9D]">
                      {t(project.summary)}
                    </p>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
        {activeProject && (
          <ProjectPreviewDialog
            key={activeProject.id}
            project={activeProject}
            lang={lang}
            onClose={() => setActiveProject(null)}
          />
        )}
      </section>

      {/* 6. TECH STACK MARQUEE + CAREER EXPERIENCE TIMELINE (Windscribe "Real Servers" Marquee Pattern) */}
      <section className="bg-[#070E17] py-20 md:py-24 border-t border-white/10 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
            {t(pageCopy.homeStackHeading)}
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-base text-[#898F9D]">
            {t(pageCopy.homeStackDescription)}
          </p>
        </div>

        {/* Dual-Row Windscribe Marquee */}
        <div className="marquee-wrapper mt-10 space-y-4 overflow-hidden select-none" dir="ltr">
          <div className="animate-ws-marquee flex gap-4">
            {marqueeRowOne.map((tech, idx) => (
              <div
                key={`r1-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-white/12 bg-[#0B0F16] px-5 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0"
              >
                <span className="w-2 h-2 rounded-xs bg-[#55FF8A]" aria-hidden="true" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
          <div className="animate-ws-marquee-reverse flex gap-4">
            {marqueeRowTwo.map((tech, idx) => (
              <div
                key={`r2-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-white/12 bg-[#0B0F16] px-5 py-3 text-sm font-semibold text-[#C2C8D4] whitespace-nowrap shrink-0"
              >
                <span className="w-2 h-2 rounded-xs bg-cyan-400" aria-hidden="true" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Career Experience Timeline */}
        <div className="mx-auto mt-20 max-w-[1280px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h3 className="font-display text-2xl md:text-4xl font-extrabold text-white">
                {t(pageCopy.homeExperienceHeading)}
              </h3>
              <p className="mt-2 text-sm text-[#898F9D]">
                {t(pageCopy.homeExperienceDescription)}
              </p>
            </div>
            <Link
              to="/about"
              className="text-sm font-bold text-[#55FF8A] hover:underline underline-offset-4 whitespace-nowrap"
            >
              {lang === 'fa' ? 'بیوگرافی کامل →' : 'Full About & Skills →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PORTFOLIO_EXPERIENCE.map((exp) => {
              const isActive = activeExpId === exp.id;
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setActiveExpId(exp.id)}
                  className={`text-start rounded-2xl border p-6 transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-[#55FF8A] bg-[#0D1A28]'
                      : 'border-white/12 bg-[#0B0F16] hover:border-white/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-mono-tech text-[#898F9D]">
                      <span>{exp.period}</span>
                      <span className="text-[#55FF8A]">{t(exp.tag)}</span>
                    </div>
                    <h4 className="mt-3 font-display text-xl font-extrabold text-white">
                      {t(exp.company)}
                    </h4>
                    <div className="mt-1 text-sm font-medium text-[#C2C8D4]">
                      {t(exp.role)}
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-[#898F9D]">
                      {exp.points[lang].map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#55FF8A] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 font-mono-tech text-[11px] text-[#55FF8A]">
                    {exp.stack}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. VERIFIABLE CERTIFICATES GALLERY PREVIEW */}
      <section className="bg-[#090E19] py-20 md:py-24 border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white">
                {t(pageCopy.homeCertificatesHeading)}
              </h2>
              <p className="mt-3 text-base text-[#898F9D]">
                {t(pageCopy.homeCertificatesDescription)}
              </p>
            </div>
            <Link
              to="/certificates"
              className="inline-flex items-center gap-2 rounded-full bg-[#102928] border border-[#55FF8A]/35 px-6 py-3 text-xs font-bold text-[#55FF8A] hover:bg-[#55FF8A] hover:text-black transition-all whitespace-nowrap self-start md:self-auto"
            >
              <span>{lang === 'fa' ? 'گالری کامل مدارک' : 'OPEN CERTIFICATES'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PORTFOLIO_CERTIFICATES.map((cert) => (
              <article
                key={cert.id}
                className="rounded-2xl border border-white/12 bg-[#0B0F16] p-5 flex flex-col justify-between hover:border-[#55FF8A]/45 transition-colors"
              >
                <div>
                  <div className="aspect-[16/11] rounded-xl overflow-hidden border border-white/10 bg-[#070E17]">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={cert.image}
                      alt={t(cert.title)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 font-mono-tech text-xs text-[#55FF8A]">
                    {t(cert.issuer)} · {cert.credentialCode}
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-white">
                    {t(cert.title)}
                  </h3>
                  <p className="mt-2 text-xs text-[#898F9D] leading-relaxed">
                    {t(cert.focus)}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#55FF8A] hover:text-white transition-colors"
                  >
                    <span>{lang === 'fa' ? 'استعلام مدرک' : 'Verify Credential'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WINDSCRIBE SPACE PORTAL CTA */}
      <SpacePortalCTA />
    </div>
  );
}
