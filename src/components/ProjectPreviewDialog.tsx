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
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
          <div>
            <h2
              id="project-preview-title"
              className="font-display text-xl font-bold text-white sm:text-2xl"
            >
              {project.title[lang]}
            </h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            aria-label={lang === 'fa' ? 'بستن پیش‌نمایش نمونه‌کار' : 'Close project preview'}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-[#090E19] text-white transition-colors hover:border-[#55FF8A] hover:text-[#55FF8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55FF8A]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <ProjectVisualFrame project={project} lang={lang} />

          <div className="space-y-6">
            <div>
              <h3 className="font-mono-tech text-[11px] uppercase tracking-wider text-[#55FF8A]">
                {lang === 'fa' ? 'فناوری‌های استفاده‌شده' : 'TECHNOLOGIES'}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((technology) => (
                  <li
                    key={technology}
                    dir="ltr"
                    className="max-w-full rounded-full border border-white/10 bg-[#070E17] px-2.5 py-1 font-mono-tech text-[11px] break-words text-[#C2C8D4]"
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
                className="inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-black transition-colors hover:bg-[#6EFF9B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55FF8A]"
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
