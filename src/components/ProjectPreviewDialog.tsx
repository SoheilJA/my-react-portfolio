import React, { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Language, PortfolioProject } from '../data/portfolioData';
import { ProjectVisualFrame } from './WindscribeArtwork';

export function ProjectPreviewDialog({
  project,
  lang,
  onClose,
}: {
  project: PortfolioProject;
  lang: Language;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      dialog.close();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="project-preview-dialog"
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      aria-labelledby="project-preview-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="project-preview-panel">
        <header className="flex items-start justify-between gap-4 border-b border-cyan-300/15 px-5 py-4 sm:px-7">
          <div>
            <p className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              {lang === 'fa' ? 'پروندهٔ نمونه‌کار' : 'PROJECT FILE'}
            </p>
            <h2
              id="project-preview-title"
              className="mt-1 font-display text-xl font-bold text-white sm:text-2xl"
            >
              {project.title[lang]}
            </h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            aria-label={lang === 'fa' ? 'بستن جزئیات نمونه‌کار' : 'Close project details'}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 bg-[#08121B] text-white transition-colors hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            style={{
              clipPath:
                'polygon(9px 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 9px)',
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <ProjectVisualFrame project={project} lang={lang} />

          <div className="space-y-6">
            <p className="text-sm leading-7 text-[#C2C8D4] sm:text-base">
              {project.summary[lang]}
            </p>

            <div>
              <h3 className="font-mono-tech text-[11px] uppercase tracking-wider text-cyan-200">
                {lang === 'fa' ? 'فناوری‌های استفاده‌شده' : 'TECHNOLOGIES'}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((technology) => (
                  <li
                    key={technology}
                    className="border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 font-mono-tech text-xs text-cyan-100"
                    style={{
                      clipPath:
                        'polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px)',
                    }}
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-cyan-300 bg-cyan-300 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#061017] transition-colors hover:bg-white hover:border-white"
                style={{
                  clipPath:
                    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                }}
              >
                <span>{lang === 'fa' ? 'مشاهدهٔ وب‌سایت' : 'VISIT WEBSITE'}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
