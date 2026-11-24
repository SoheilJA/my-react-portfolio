import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogoMark } from './WindscribeArtwork';

const INTRO_SEEN_KEY = 'soheil_portfolio_intro_seen';
type AnimationPhase = 'entering' | 'exiting' | 'hidden';

function shouldShowIntro() {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) {
    return false;
  }
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) !== 'true';
  } catch {
    return true;
  }
}

function PortalMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`site-portal-mark ${compact ? 'site-portal-mark--compact' : ''}`}
      aria-hidden="true"
    >
      <span className="site-portal-ring site-portal-ring--outer" />
      <span className="site-portal-ring site-portal-ring--inner" />
      <span className="site-portal-core" />
      <BrandLogoMark
        className={`site-portal-logo ${compact ? 'site-portal-logo--compact' : ''}`}
      />
      <span className="site-portal-beacon" />
    </div>
  );
}

function EntryPreloader() {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState<AnimationPhase>(() =>
    shouldShowIntro() ? 'entering' : 'hidden',
  );

  useEffect(() => {
    if (phase !== 'entering') return;
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      // Keep the intro available even when browser storage is disabled.
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(
      () => setPhase('exiting'),
      reducedMotion ? 250 : 1250,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const timer = window.setTimeout(() => setPhase('hidden'), 450);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={lang === 'fa' ? 'در حال آماده‌سازی سایت' : 'Preparing the portfolio'}
      className={`site-entry-preloader ${phase === 'exiting' ? 'is-exiting' : 'is-entering'}`}
    >
      <div className="site-entry-glow" />
      <div className="site-entry-grid" />
      <div className="site-entry-content">
        <PortalMark />
        <p className="site-entry-caption">
          {lang === 'fa' ? 'در حال آماده‌سازی تجربهٔ شما' : 'Building your digital experience'}
        </p>
        <div className="site-entry-progress">
          <span />
        </div>
        <span className="site-entry-status" dir="ltr">INITIALIZING · 01</span>
      </div>
    </div>
  );
}

function RouteTransition() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const previousPath = useRef(pathname);
  const hasMounted = useRef(false);
  const [phase, setPhase] = useState<AnimationPhase>('hidden');

  useEffect(() => {
    if (previousPath.current === pathname) {
      hasMounted.current = true;
      return;
    }
    const from = previousPath.current;
    previousPath.current = pathname;
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (from.startsWith('/admin') || pathname.startsWith('/admin') || from === '/') {
      return;
    }

    setPhase('entering');
    const exitTimer = window.setTimeout(() => setPhase('exiting'), 340);
    const hideTimer = window.setTimeout(() => setPhase('hidden'), 560);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (phase === 'hidden') return null;

  return (
    <div
      aria-hidden="true"
      className={`site-route-warp ${phase === 'exiting' ? 'is-exiting' : 'is-entering'}`}
    >
      <PortalMark compact />
      <span className="site-route-caption" dir="ltr">
        {lang === 'fa' ? 'در حال انتقال' : 'WARPING'}
      </span>
      <span className="site-route-progress" />
    </div>
  );
}

export function SiteLoadingEffects() {
  return (
    <>
      <EntryPreloader />
      <RouteTransition />
    </>
  );
}
