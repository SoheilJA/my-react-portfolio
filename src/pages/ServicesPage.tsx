import React from 'react';
import { LocalizedLink as Link } from '../components/LocalizedLink';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import { ServiceBentoArt } from '../components/WindscribeArtwork';
import { SpacePortalCTA } from '../components/SpacePortalCTA';

export function ServicesPage() {
  const { lang, isRtl, t } = useLanguage();
  const { content } = usePortfolioContent();
  const { assets: ARTWORK_ASSETS, services: PORTFOLIO_SERVICES } = content;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#090E19]">
      {/* Services Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/10">
        <img
          loading="lazy"
          decoding="async"
          src={ARTWORK_ASSETS.servicesGeometric}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090E19]/75 via-[#090E19]/70 to-[#090E19]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8 text-center">
          <p className="font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
            {lang === 'fa' ? 'خدمات تخصصی وب' : 'WEB ENGINEERING & DESIGN SERVICES'}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06] [text-wrap:balance]">
            {t(content.pageCopy.servicesHeading)}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-[#C2C8D4] leading-relaxed">
            {t(content.pageCopy.servicesDescription)}
          </p>
        </div>
      </section>

      {/* Alternating Deep Service Rows */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 space-y-14">
          {PORTFOLIO_SERVICES.map((svc, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <article
                key={svc.id}
                className="rounded-3xl border border-white/12 bg-[#0B0F16] p-6 md:p-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12"
              >
                <div className={`lg:col-span-6 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="font-mono-tech text-xs text-[#55FF8A]">
                    0{idx + 1} · {svc.stack.join(' · ')}
                  </div>
                  <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    {t(svc.title)}
                  </h2>
                  <p className="mt-3.5 text-base text-[#898F9D] leading-relaxed">
                    {t(svc.desc)}
                  </p>

                  <ul className="mt-6 space-y-2.5 text-sm text-[#C2C8D4]">
                    {svc.deliverables[lang].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#55FF8A] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      to={`/contact?service=${svc.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] transition-all whitespace-nowrap"
                    >
                      <span>{lang === 'fa' ? 'درخواست این خدمت' : 'REQUEST THIS SERVICE'}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className={`lg:col-span-6 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="rounded-2xl border border-white/10 bg-[#070E17] p-6 md:p-8">
                    <ServiceBentoArt variant={svc.artVariant} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <SpacePortalCTA />
    </div>
  );
}
