import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);
}

export function useGsapPageMotion(pathname: string) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedHeader = useRef(false);

  useEffect(() => {
    const root = containerRef.current;
    if (typeof window === 'undefined') {
      return;
    }

    document.documentElement.classList.remove('site-motion-ready');
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let context: gsap.Context | undefined;
    let observer: MutationObserver | undefined;
    let refreshFrame: number | undefined;
    let readyFrame: number | undefined;
    let started = false;
    const batchTriggers: ScrollTrigger[] = [];
    const batchTweens: gsap.core.Tween[] = [];
    const batchItems: HTMLElement[] = [];
    const removeHoverListeners: Array<() => void> = [];

    const startMotion = () => {
      if (
        started ||
        document.querySelector('.site-entry-preloader, .site-route-warp')
      ) {
        return;
      }
      started = true;
      observer?.disconnect();
      document.documentElement.classList.add('site-motion-ready');

      context = gsap.context(() => {
        const page = root.querySelector<HTMLElement>('main > *');
        if (page) {
          gsap.fromTo(
            page,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
              clearProps: 'opacity,transform,visibility',
            },
          );
        }

        if (!hasAnimatedHeader.current) {
          const header = root.querySelector<HTMLElement>('header');
          if (header) {
            gsap.fromTo(
              header,
              { autoAlpha: 0, y: -12 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                delay: 0.1,
                ease: 'power2.out',
                clearProps: 'opacity,transform,visibility',
              },
            );
            hasAnimatedHeader.current = true;
          }
        }

        root.querySelectorAll<HTMLElement>('main section').forEach((section) => {
          const heading = section.querySelector<HTMLElement>('h1, h2');
          const candidates = Array.from(
            section.querySelectorAll<HTMLElement>('article, .grid > *'),
          );
          const items = candidates.filter(
            (item) => !candidates.some((other) => other !== item && other.contains(item)),
          );
          const createScrollTrigger = () => ({
            trigger: section,
            start: 'top 88%',
            once: true,
          });

          if (items.length) {
            if (heading) {
              gsap.fromTo(
                heading,
                { autoAlpha: 0, y: 16 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.55,
                  ease: 'power2.out',
                  clearProps: 'opacity,transform,visibility',
                  scrollTrigger: createScrollTrigger(),
                },
              );
            }

            batchItems.push(...items);
            gsap.set(items, { autoAlpha: 0, y: 22, scale: 0.985 });
            batchTriggers.push(
              ...ScrollTrigger.batch(items, {
                start: 'top 90%',
                once: true,
                batchMax: 6,
                interval: 0.08,
                onEnter: (batch) => {
                  batchTweens.push(
                    gsap.fromTo(
                      batch,
                      { autoAlpha: 0, y: 22, scale: 0.985 },
                      {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.55,
                        stagger: 0.06,
                        ease: 'power2.out',
                        clearProps: 'opacity,transform,visibility',
                      },
                    ),
                  );
                },
              }),
            );
          } else {
            gsap.fromTo(
              section,
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                ease: 'power2.out',
                clearProps: 'opacity,transform,visibility',
                scrollTrigger: createScrollTrigger(),
              },
            );
          }
        });

        const footer = root.querySelector<HTMLElement>('footer');
        const footerItems = footer
          ? Array.from(footer.querySelectorAll<HTMLElement>('.grid > *'))
          : [];
        if (footer && footerItems.length) {
          gsap.fromTo(
            footerItems,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: 'power2.out',
              clearProps: 'opacity,transform,visibility',
              scrollTrigger: {
                trigger: footer,
                start: 'top 92%',
                once: true,
              },
            },
          );
        }
      }, root);

      const hoverTargets = Array.from(
        root.querySelectorAll<HTMLElement>('main a.rounded-full, main button, footer a'),
      );
      hoverTargets.forEach((element) => {
        const onEnter = () => {
          gsap.to(element, {
            y: -2,
            scale: 1.025,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };
        const onLeave = () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        element.addEventListener('pointerenter', onEnter);
        element.addEventListener('pointerleave', onLeave);
        removeHoverListeners.push(() => {
          element.removeEventListener('pointerenter', onEnter);
          element.removeEventListener('pointerleave', onLeave);
          gsap.killTweensOf(element);
          gsap.set(element, { clearProps: 'transform' });
        });
      });

      refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    observer = new MutationObserver(startMotion);
    observer.observe(document.body, { childList: true, subtree: true });
    readyFrame = window.requestAnimationFrame(startMotion);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      if (refreshFrame !== undefined) window.cancelAnimationFrame(refreshFrame);
      observer?.disconnect();
      removeHoverListeners.forEach((remove) => remove());
      batchTweens.forEach((tween) => tween.kill());
      batchTriggers.forEach((trigger) => trigger.kill());
      context?.revert();
      batchItems.forEach((item) => gsap.set(item, { clearProps: 'opacity,transform,visibility' }));
      document.documentElement.classList.remove('site-motion-ready');
    };
  }, [pathname]);

  return containerRef;
}
