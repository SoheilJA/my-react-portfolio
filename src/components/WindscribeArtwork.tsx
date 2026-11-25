import React, { useState } from 'react';
import { Language, PortfolioProject, PortfolioService } from '../data/portfolioData';

export function BrandLogoMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="18,2 32,10 32,26 18,34 4,26 4,10"
        fill="#0B1628"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="18,7 27,12.2 27,23.8 18,29 9,23.8 9,12.2"
        fill="#090E19"
        stroke="#55FF8A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 13.5H15.5C14.1 13.5 13 14.4 13 15.6C13 16.8 14.1 17.7 15.5 17.7H20.5C21.9 17.7 23 18.6 23 19.8C23 21 21.9 22 20.5 22H14"
        stroke="#55FF8A"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FourPointStarField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-full opacity-40"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M160 70 Q168 125 225 135 Q168 145 160 200 Q152 145 95 135 Q152 125 160 70 Z"
          fill="#11192B"
        />
        <path
          d="M990 120 Q1002 195 1080 210 Q1002 225 990 300 Q978 225 900 210 Q978 195 990 120 Z"
          fill="#101829"
        />
        <path
          d="M610 380 Q616 420 658 428 Q616 436 610 476 Q604 436 562 428 Q604 420 610 380 Z"
          fill="#11192B"
        />
      </svg>
    </div>
  );
}

interface ConsolePreset {
  id: 'django' | 'laravel' | 'wordpress';
  label: string;
  endpoint: string;
  runtime: string;
  infra: string;
  metric: string;
}

const CONSOLE_PRESETS: ConsolePreset[] = [
  {
    id: 'django',
    label: 'Django',
    endpoint: 'api.soheil.dev / core',
    runtime: 'Python 3.12 · Django',
    infra: 'Docker · Runflare',
    metric: 'MVT + Admin',
  },
  {
    id: 'laravel',
    label: 'Laravel',
    endpoint: 'siyas.app / engine',
    runtime: 'PHP 8.3 · Laravel',
    infra: 'Three.js · Tailwind',
    metric: 'Edge + 3D',
  },
  {
    id: 'wordpress',
    label: 'WordPress',
    endpoint: 'store.client / wp',
    runtime: 'Elementor · WoodMart',
    infra: 'RTL Commerce · SEO',
    metric: '30+ Shipped',
  },
];

export function InteractiveHeroConsole({ lang }: { lang: Language }) {
  const [activeStack, setActiveStack] = useState<'django' | 'laravel' | 'wordpress'>('django');
  const [poweredOn, setPoweredOn] = useState(true);

  const current = CONSOLE_PRESETS.find((p) => p.id === activeStack) ?? CONSOLE_PRESETS[0];

  return (
    <div
      className="relative mx-auto w-full max-w-[460px] select-none"
      data-testid="hero-console"
    >
      {/* Ambient emerald under-glow matching Windscribe's hero hardware box */}
      <div
        className={`absolute -inset-3 rounded-3xl blur-2xl transition-opacity duration-300 ${
          poweredOn ? 'bg-[#55FF8A]/20 opacity-90' : 'bg-cyan-500/10 opacity-30'
        }`}
        aria-hidden="true"
      />

      {/* Comic-inked angled hardware/UI frame */}
      <div
        dir="ltr"
        className="relative rounded-2xl border-2 border-[#02050A] bg-[#0B1324] shadow-[0_24px_60px_rgba(0,0,0,0.75)] ring-1 ring-[#55FF8A]/45 overflow-hidden transition-transform duration-500 md:-rotate-2 hover:rotate-0 hover:-translate-y-1"
      >
        {/* Top metallic/teal header strip */}
        <div className="relative bg-gradient-to-br from-[#0F2C3F] via-[#0B1C2E] to-[#091221] px-5 pt-4 pb-5 border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <BrandLogoMark className="w-6 h-6" />
              <span className="font-display font-bold tracking-tight text-white text-base">
                soheil<span className="text-[#55FF8A]">.dev</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-black/40 border border-white/15 text-[#55FF8A]">
                {poweredOn ? 'ONLINE' : 'STANDBY'}
              </span>
              <button
                type="button"
                onClick={() => setPoweredOn((prev) => !prev)}
                aria-label={
                  lang === 'fa'
                    ? 'تغییر وضعیت کنسول توسعه‌دهنده'
                    : 'Toggle developer console power state'
                }
                className={`w-11 h-11 rounded-full border-2 border-[#030710] flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55FF8A] ${
                  poweredOn
                    ? 'bg-[#55FF8A] text-black shadow-[0_0_20px_rgba(85,255,138,0.55)] hover:scale-105'
                    : 'bg-[#172136] text-[#898F9D] hover:text-white'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 3v9" strokeLinecap="round" />
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono-tech text-[11px] uppercase tracking-widest text-cyan-300/80">
                {current.endpoint}
              </div>
              <div className="mt-0.5 font-display text-2xl font-extrabold tracking-tight text-white">
                Mashhad <span className="text-[#898F9D] font-normal text-base">/ IR</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono-tech text-[11px] text-[#898F9D] uppercase">
                {current.metric}
              </div>
              <div className="mt-1 flex items-center justify-end gap-1" aria-hidden="true">
                <span className={`w-1.5 h-2 rounded-sm ${poweredOn ? 'bg-[#55FF8A]' : 'bg-white/20'}`} />
                <span className={`w-1.5 h-3 rounded-sm ${poweredOn ? 'bg-[#55FF8A]' : 'bg-white/20'}`} />
                <span className={`w-1.5 h-4 rounded-sm ${poweredOn ? 'bg-[#55FF8A]' : 'bg-white/20'}`} />
                <span className={`w-1.5 h-5 rounded-sm ${poweredOn ? 'bg-[#55FF8A]' : 'bg-white/20'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Lower console telemetry & interactive stack switcher */}
        <div className="bg-[#0B0F16] px-5 py-4 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
            <span className="text-[#898F9D] font-mono-tech uppercase tracking-wider">
              Runtime
            </span>
            <span className="text-white font-mono-tech font-medium">{current.runtime}</span>
          </div>
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="text-[#898F9D] font-mono-tech uppercase tracking-wider">
              Delivery
            </span>
            <span className="text-[#55FF8A] font-mono-tech font-medium">{current.infra}</span>
          </div>

          <div
            className="grid grid-cols-3 gap-1.5 pt-1 bg-[#070E17] p-1.5 rounded-xl border border-white/10"
            role="tablist"
            aria-label={lang === 'fa' ? 'انتخاب استک فنی' : 'Select technical stack'}
          >
            {CONSOLE_PRESETS.map((preset) => {
              const isSelected = preset.id === activeStack;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStack(preset.id)}
                  className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#55FF8A] ${
                    isSelected
                      ? 'bg-[#55FF8A] text-black shadow-sm'
                      : 'text-[#898F9D] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceBentoArt({
  variant,
}: {
  variant: PortfolioService['artVariant'];
}) {
  switch (variant) {
    case 'backend':
      return (
        <svg viewBox="0 0 320 170" className="service-art service-art--backend w-full h-44" fill="none" aria-hidden="true">
          <rect x="28" y="22" width="264" height="126" rx="14" fill="#070E17" stroke="#22D3EE" strokeOpacity="0.35" strokeWidth="2" />
          <rect x="44" y="38" width="98" height="38" rx="8" fill="#0E2033" stroke="#55FF8A" strokeWidth="2" />
          <circle className="service-art-pulse" cx="62" cy="57" r="6" fill="#55FF8A" />
          <rect x="76" y="51" width="50" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.85" />
          <rect x="76" y="61" width="34" height="4" rx="2" fill="#898F9D" />

          <rect x="178" y="38" width="98" height="38" rx="8" fill="#0E2033" stroke="#22D3EE" strokeWidth="2" />
          <rect x="192" y="50" width="54" height="5" rx="2.5" fill="#22D3EE" />
          <rect x="192" y="60" width="68" height="4" rx="2" fill="#898F9D" />

          <path className="service-art-flow" d="M142 57 H178" stroke="#55FF8A" strokeWidth="2.5" strokeDasharray="4 4" />
          <path className="service-art-flow" d="M93 76 V96 H227 V76" stroke="#55FF8A" strokeOpacity="0.6" strokeWidth="2" />
          <rect className="service-art-pulse" x="86" y="96" width="148" height="36" rx="8" fill="#102926" stroke="#55FF8A" strokeWidth="2" />
          <text x="160" y="118" textAnchor="middle" fill="#55FF8A" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
            DJANGO / LARAVEL
          </text>
        </svg>
      );

    case 'ecommerce':
      return (
        <svg viewBox="0 0 320 170" className="service-art service-art--ecommerce w-full h-44" fill="none" aria-hidden="true">
          <rect x="34" y="20" width="252" height="130" rx="14" fill="#070E17" stroke="white" strokeOpacity="0.14" strokeWidth="2" />
          <rect x="52" y="38" width="124" height="94" rx="10" fill="#0F192B" stroke="#55FF8A" strokeOpacity="0.6" strokeWidth="2" />
          <rect x="64" y="50" width="100" height="44" rx="6" fill="#132B33" />
          <path className="service-art-flow" d="M84 72 L100 58 L114 70 L128 56 L144 76" stroke="#55FF8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="64" y="104" width="60" height="6" rx="3" fill="#FFFFFF" />
          <rect x="64" y="116" width="38" height="5" rx="2.5" fill="#898F9D" />

          <rect className="service-art-pulse" x="192" y="38" width="78" height="42" rx="8" fill="#112926" stroke="#55FF8A" strokeWidth="2" />
          <text x="231" y="63" textAnchor="middle" fill="#55FF8A" fontSize="12" fontFamily="IBM Plex Mono, monospace" fontWeight="700">
            CHECKOUT
          </text>
          <rect x="192" y="90" width="78" height="42" rx="8" fill="#0F172A" stroke="#22D3EE" strokeOpacity="0.6" strokeWidth="2" />
          <circle className="service-art-pulse" cx="212" cy="111" r="8" fill="#22D3EE" fillOpacity="0.25" stroke="#22D3EE" strokeWidth="2" />
          <rect x="228" y="107" width="30" height="8" rx="3" fill="#FFFFFF" fillOpacity="0.8" />
        </svg>
      );

    case 'corporate':
      return (
        <svg viewBox="0 0 320 170" className="service-art service-art--corporate w-full h-44" fill="none" aria-hidden="true">
          <rect x="30" y="24" width="260" height="122" rx="12" fill="#070E17" stroke="white" strokeOpacity="0.16" strokeWidth="2" />
          <circle cx="48" cy="40" r="4" fill="#55FF8A" />
          <circle cx="62" cy="40" r="4" fill="#22D3EE" />
          <circle cx="76" cy="40" r="4" fill="#898F9D" />
          <line x1="30" y1="54" x2="290" y2="54" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />

          <rect x="48" y="70" width="110" height="14" rx="4" fill="#FFFFFF" />
          <rect x="48" y="92" width="90" height="7" rx="3" fill="#898F9D" />
          <rect x="48" y="105" width="72" height="7" rx="3" fill="#898F9D" fillOpacity="0.6" />
          <rect className="service-art-pulse" x="48" y="122" width="64" height="14" rx="7" fill="#55FF8A" />

          <polygon className="service-art-hex-outer" points="225,68 265,91 265,128 225,140 185,128 185,91" fill="#0D2330" stroke="#55FF8A" strokeWidth="2" />
          <polygon className="service-art-hex-inner" points="225,80 250,95 250,119 225,128 200,119 200,95" fill="#123438" stroke="#22D3EE" strokeWidth="1.5" />
        </svg>
      );

    case 'marketplace':
      return (
        <svg viewBox="0 0 320 170" className="service-art service-art--marketplace w-full h-44" fill="none" aria-hidden="true">
          <circle className="service-art-orbit" cx="160" cy="85" r="56" stroke="#55FF8A" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="5 5" />
          <rect className="service-art-pulse" x="122" y="64" width="76" height="42" rx="10" fill="#102826" stroke="#55FF8A" strokeWidth="2.5" />
          <text x="160" y="89" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="700">
            HUB CORE
          </text>

          <rect x="30" y="30" width="66" height="32" rx="8" fill="#0E1726" stroke="#22D3EE" strokeWidth="2" />
          <rect x="224" y="30" width="66" height="32" rx="8" fill="#0E1726" stroke="#22D3EE" strokeWidth="2" />
          <rect x="30" y="108" width="66" height="32" rx="8" fill="#0E1726" stroke="#55FF8A" strokeWidth="2" />
          <rect x="224" y="108" width="66" height="32" rx="8" fill="#0E1726" stroke="#55FF8A" strokeWidth="2" />

          <path className="service-art-flow" d="M96 46 L124 72 M224 46 L196 72 M96 124 L124 98 M224 124 L196 98" stroke="#55FF8A" strokeWidth="2" />
        </svg>
      );

    case 'portfolio':
    default:
      return (
        <svg viewBox="0 0 320 170" className="service-art service-art--portfolio w-full h-44" fill="none" aria-hidden="true">
          <rect x="42" y="24" width="236" height="122" rx="14" fill="#070E17" stroke="#55FF8A" strokeOpacity="0.45" strokeWidth="2" />
          <circle className="service-art-pulse" cx="222" cy="85" r="32" fill="#0D292C" stroke="#55FF8A" strokeWidth="2.5" />
          <ellipse className="service-art-orbit" cx="222" cy="85" rx="48" ry="13" transform="rotate(-18 222 85)" stroke="#22D3EE" strokeWidth="2" />
          <rect x="64" y="50" width="92" height="12" rx="4" fill="#FFFFFF" />
          <rect x="64" y="72" width="76" height="8" rx="3" fill="#55FF8A" />
          <rect x="64" y="92" width="84" height="6" rx="3" fill="#898F9D" />
          <rect className="service-art-pulse" x="64" y="112" width="58" height="16" rx="8" fill="#55FF8A" />
        </svg>
      );
  }
}

export function ProjectVisualFrame({
  project,
  lang,
  compact = false,
}: {
  project: PortfolioProject;
  lang: Language;
  compact?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (project.image && !imgFailed) {
    return (
      <div
        className={`project-screen-frame relative flex flex-col border-2 border-[#02050A] bg-[#0B1324] overflow-hidden ring-1 ring-white/15 shadow-[0_18px_45px_rgba(0,0,0,0.65)] ${
          compact ? 'aspect-[16/10]' : 'aspect-[16/10]'
        }`}
      >
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#070E17] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55FF8A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
          </div>
          <span className="font-mono-tech text-[10px] text-[#898F9D] truncate max-w-[200px]">
            {project.slug}.soheil.dev
          </span>
        </div>
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <img
            loading="lazy"
            decoding="async"
            src={project.image}
            alt={project.title[lang]}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    );
  }

  const accentHex = '#55FF8A';

  return (
    <div
      className={`project-screen-frame relative border-2 border-[#02050A] bg-[#070E17] overflow-hidden ring-1 ring-white/15 shadow-[0_18px_45px_rgba(0,0,0,0.65)] flex flex-col ${
        compact ? 'aspect-[16/10]' : 'aspect-[16/10]'
      }`}
    >
      {/* Stylized browser frame */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0B111E] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentHex }} />
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#898F9D]">
          PORTFOLIO PROJECT
        </span>
      </div>

      {/* Windscribe comic-technical blueprint preview */}
      <div className="relative flex-1 p-5 flex flex-col justify-between overflow-hidden ws-grid-overlay">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mt-1 font-display font-bold text-white text-lg md:text-xl leading-tight">
              {project.title[lang]}
            </div>
          </div>
        </div>

        {/* Wireframe interface bars */}
        <div className="mt-4 flex flex-wrap gap-2" aria-label={project.tech.join(', ')}>
          {project.tech.slice(0, 5).map((technology) => (
            <span
              key={technology}
              className="rounded-md border border-[#55FF8A]/25 bg-[#0E2426]/90 px-2.5 py-1.5 font-mono-tech text-[10px] text-[#55FF8A]"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PathBannerMascot({ side }: { side: 'left' | 'right' }) {
  if (side === 'left') {
    return (
      <svg viewBox="0 0 110 110" className="w-20 h-20 md:w-24 md:h-24 shrink-0" fill="none" aria-hidden="true">
        <circle cx="55" cy="55" r="34" fill="#102C2E" stroke="#030710" strokeWidth="3" />
        <circle cx="55" cy="55" r="34" stroke="#55FF8A" strokeWidth="2.5" />
        <ellipse cx="55" cy="55" rx="48" ry="14" transform="rotate(-22 55 55)" stroke="#22D3EE" strokeWidth="2.5" />
        <path d="M44 46L35 55L44 64M66 46L75 55L66 64M58 43L52 67" stroke="#55FF8A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 110 110" className="w-20 h-20 md:w-24 md:h-24 shrink-0" fill="none" aria-hidden="true">
      <polygon points="55,14 90,34 90,76 55,96 20,76 20,34" fill="#0E2033" stroke="#55FF8A" strokeWidth="2.5" />
      <polygon points="55,27 78,40 78,70 55,83 32,70 32,40" fill="#090E19" stroke="#22D3EE" strokeWidth="2" />
      <circle cx="55" cy="55" r="9" fill="#55FF8A" />
    </svg>
  );
}
