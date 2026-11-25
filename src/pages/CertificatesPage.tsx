import React, { useEffect, useState } from 'react';
import { Award, ExternalLink, Maximize2, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PortfolioCertificate } from '../data/portfolioData';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import { FourPointStarField } from '../components/WindscribeArtwork';
import { SpacePortalCTA } from '../components/SpacePortalCTA';

export function CertificatesPage() {
  const { lang, t } = useLanguage();
  const { content } = usePortfolioContent();
  const { certificates: PORTFOLIO_CERTIFICATES } = content;
  const [activeCert, setActiveCert] = useState<PortfolioCertificate | null>(null);

  useEffect(() => {
    if (!activeCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert]);

  return (
    <div className="bg-[#090E19]">
      {/* Header */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/10">
        <FourPointStarField />
        <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lang === 'fa'
                  ? 'مدارک رسمی و قابل استعلام'
                  : 'VERIFIABLE ACADEMIC & TECHNICAL CREDENTIALS'}
              </span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06] [text-wrap:balance]">
              {t(content.pageCopy.certificatesHeading)}
            </h1>

            <p className="mt-4 text-base md:text-lg text-[#C2C8D4] leading-relaxed">
              {t(content.pageCopy.certificatesDescription)}
            </p>
          </div>
        </div>
      </section>

      {/* Certificates Showcase */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-[#070E17]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {PORTFOLIO_CERTIFICATES.map((cert) => (
              <article
                key={cert.id}
                className="group rounded-2xl border border-white/12 bg-[#0B0F16] p-5 flex flex-col justify-between hover:border-[#55FF8A]/50 transition-colors"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveCert(cert)}
                    aria-label={
                      lang === 'fa'
                        ? `بزرگنمایی مدرک ${t(cert.title)}`
                        : `Inspect ${t(cert.title)} certificate`
                    }
                    className="relative block w-full overflow-hidden rounded-xl border border-white/15 bg-[#090E19] cursor-pointer text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55FF8A]"
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={cert.image}
                      alt={t(cert.title)}
                      referrerPolicy="no-referrer"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-full bg-[#090E19]/90 border border-white/20 px-3 py-1.5 text-[11px] font-bold text-white group-hover:border-[#55FF8A] group-hover:text-[#55FF8A] transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? 'بزرگنمایی' : 'Inspect'}</span>
                    </span>
                  </button>

                  <div className="mt-5 flex items-center justify-between gap-2 font-mono-tech text-xs">
                    <span className="text-[#55FF8A] uppercase tracking-wider">
                      {t(cert.issuer)}
                    </span>
                    <span className="text-[#898F9D]">{cert.credentialCode}</span>
                  </div>

                  <h2 className="mt-2 font-display text-xl font-bold text-white leading-snug">
                    {t(cert.title)}
                  </h2>

                  <p className="mt-2.5 text-sm text-[#898F9D] leading-relaxed">
                    {t(cert.focus)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveCert(cert)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#102928] px-4 py-2 text-xs font-bold text-[#55FF8A] hover:bg-[#55FF8A] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'مشاهده تصویر' : 'Preview'}</span>
                  </button>

                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2C8D4] hover:text-[#55FF8A] transition-colors whitespace-nowrap"
                  >
                    <span>{lang === 'fa' ? 'استعلام رسمی' : 'Verify Online'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SpacePortalCTA />

      {/* Lightbox Modal */}
      {activeCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04070D]/90 p-4 md:p-8 backdrop-blur-sm"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0B0F16] p-5 md:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="font-mono-tech text-xs text-[#55FF8A]">
                  {t(activeCert.issuer)} · {activeCert.credentialCode}
                </div>
                <h2
                  id="cert-modal-title"
                  className="mt-1 font-display text-xl md:text-2xl font-bold text-white"
                >
                  {t(activeCert.title)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                aria-label={lang === 'fa' ? 'بستن پیش‌نمایش' : 'Close certificate preview'}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-white/15 bg-[#090E19] text-white hover:border-[#55FF8A] hover:text-[#55FF8A] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#070E17]">
              <img
                loading="lazy"
                decoding="async"
                src={activeCert.image}
                alt={t(activeCert.title)}
                referrerPolicy="no-referrer"
                className="w-full max-h-[65vh] object-contain mx-auto"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[#C2C8D4]">{t(activeCert.focus)}</p>
              <a
                href={activeCert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] transition-colors whitespace-nowrap"
              >
                <span>{lang === 'fa' ? 'لینک استعلام اصلی' : 'OPEN VERIFICATION'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
