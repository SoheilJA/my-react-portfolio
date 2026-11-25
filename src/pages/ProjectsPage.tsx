import React, { useEffect, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import { filterProjects } from '../utils/portfolioLogic';
import { PortfolioProject } from '../data/portfolioData';
import { ProjectPreviewDialog } from '../components/ProjectPreviewDialog';
import { ProjectVisualFrame } from '../components/WindscribeArtwork';
import { SpacePortalCTA } from '../components/SpacePortalCTA';

export function ProjectsPage() {
  const { lang, t } = useLanguage();
  const { content } = usePortfolioContent();
  const { assets: ARTWORK_ASSETS, projects: PORTFOLIO_PROJECTS } = content;
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  const filtered = filterProjects(PORTFOLIO_PROJECTS, query, lang);

  useEffect(() => {
    if (!slug) return;
    setActiveProject(
      PORTFOLIO_PROJECTS.find((project) => project.slug === slug) ?? null,
    );
  }, [PORTFOLIO_PROJECTS, slug]);

  const closeProject = () => {
    setActiveProject(null);
    if (slug) navigate(`/${lang}/projects`, { replace: true });
  };

  return (
    <div className="bg-[#090E19]">
      {/* Projects Header with Cosmic Backdrop */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/10">
        <img
          loading="lazy"
          decoding="async"
          src={ARTWORK_ASSETS.projectsBackdrop}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090E19]/75 via-[#090E19]/65 to-[#090E19]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
              {lang === 'fa'
                ? `${PORTFOLIO_PROJECTS.length} پروژه واقعی تحویل‌شده`
                : `${PORTFOLIO_PROJECTS.length} SHIPPED PRODUCTION PROJECTS`}
            </p>
            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06]">
              {t(content.pageCopy.projectsHeading)}
            </h1>
            <p className="mt-4 text-base md:text-lg text-[#C2C8D4] leading-relaxed">
              {t(content.pageCopy.projectsDescription)}
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-10 flex justify-end">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#898F9D] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <label htmlFor="project-search" className="sr-only">
                {lang === 'fa' ? 'جستجو در پروژه‌ها' : 'Search projects'}
              </label>
              <input
                id="project-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === 'fa'
                    ? 'جستجو نام پروژه یا تکنولوژی (مثلاً Django)...'
                    : 'Search name or tech (e.g. Django)...'
                }
                className="w-full rounded-xl border border-white/15 bg-[#0B0F16] py-2.5 ps-10 pe-4 text-sm text-white placeholder-[#898F9D] focus:border-[#55FF8A] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/12 bg-[#0B0F16] p-12 text-center">
              <p className="text-lg font-bold text-white">
                {lang === 'fa'
                  ? 'پروژه‌ای با این فیلتر یافت نشد.'
                  : 'No matching projects found.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                }}
                className="mt-4 rounded-full bg-[#55FF8A] px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-black cursor-pointer"
              >
                {lang === 'fa' ? 'نمایش همه پروژه‌ها' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <article
                  key={project.id}
                  className="project-card group"
                >
                  <div className="project-card__content flex h-full flex-col justify-between p-4 sm:p-5">
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

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tech.slice(0, 4).map((technology) => (
                          <span
                            key={technology}
                            className="border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 font-mono-tech text-[10px] text-cyan-100"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>

                      <h2 className="mt-3 font-display text-xl font-bold text-white transition-colors group-hover:text-cyan-200">
                        {t(project.title)}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#AEB7C8]">
                        {t(project.summary)}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 font-mono-tech text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                        {lang === 'fa' ? 'نمایش جزئیات پروژه' : 'OPEN PROJECT FILE'}
                      </span>
                    </button>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-end gap-3">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-[#C2C8D4] transition-colors hover:text-[#55FF8A]"
                          >
                            <span>{lang === 'fa' ? 'مشاهده سایت' : 'Live'}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeProject && (
        <ProjectPreviewDialog
          key={activeProject.id}
          project={activeProject}
          lang={lang}
          onClose={closeProject}
        />
      )}

      <SpacePortalCTA />
    </div>
  );
}
