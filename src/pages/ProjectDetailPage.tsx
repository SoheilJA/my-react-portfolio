import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { LocalizedLink as Link } from '../components/LocalizedLink';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import { getAdjacentProjects, getProjectBySlug } from '../utils/portfolioLogic';
import { ProjectVisualFrame } from '../components/WindscribeArtwork';
import { SpacePortalCTA } from '../components/SpacePortalCTA';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRtl, t } = useLanguage();
  const { content } = usePortfolioContent();
  const { projects: PORTFOLIO_PROJECTS } = content;

  const project = getProjectBySlug(PORTFOLIO_PROJECTS, slug);

  if (!project) {
    return (
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 text-center">
        <h1 className="font-display text-3xl font-black text-white">
          {lang === 'fa' ? 'پروژه مورد نظر پیدا نشد' : 'Project Not Found'}
        </h1>
        <p className="mt-3 text-[#898F9D]">
          {lang === 'fa'
            ? 'ممکن است نشانی پروژه تغییر کرده باشد.'
            : 'The requested project entry could not be found.'}
        </p>
        <Link
          to="/projects"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black"
        >
          <span>{lang === 'fa' ? 'بازگشت به همه نمونه‌کارها' : 'BACK TO PROJECTS'}</span>
        </Link>
      </div>
    );
  }

  const { prev, next } = getAdjacentProjects(PORTFOLIO_PROJECTS, project.slug);
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const NextArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#090E19]">
      <section className="py-12 md:py-20 border-b border-white/10">
        <div className="mx-auto max-w-[1160px] px-5 md:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#898F9D] hover:text-[#55FF8A] transition-colors"
          >
            <BackArrow className="w-4 h-4" />
            <span>{lang === 'fa' ? 'بازگشت به نمونه‌کارها' : 'All Projects'}</span>
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t(project.title)}
              </h1>

              <p className="mt-4 text-base md:text-lg text-[#C2C8D4] leading-relaxed">
                {t(project.summary)}
              </p>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-white/12 bg-[#0B0F16] p-6 space-y-4">
              <div>
                <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#898F9D]">
                  {lang === 'fa' ? 'تکنولوژی‌های استفاده‌شده' : 'Technology Stack'}
                </div>
                <div className="mt-1.5 font-mono-tech text-sm font-semibold text-[#55FF8A]">
                  {project.tech.join(' · ')}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] transition-all whitespace-nowrap"
                  >
                    <span>{lang === 'fa' ? 'مشاهده وب‌سایت زنده' : 'VISIT LIVE SITE'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#55FF8A]/35 bg-[#102928] px-6 py-3 text-xs font-bold text-[#55FF8A] hover:bg-[#55FF8A] hover:text-black transition-all whitespace-nowrap"
                >
                  <span>{lang === 'fa' ? 'سفارش پروژه مشابه' : 'Build Similar Project'}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <ProjectVisualFrame project={project} lang={lang} />
          </div>

          {/* Adjacent Project Navigation */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev && (
              <Link
                to={`/projects/${prev.slug}`}
                className="rounded-2xl border border-white/12 bg-[#0B0F16] p-5 hover:border-[#55FF8A]/45 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-mono-tech text-xs text-[#898F9D]">
                    {lang === 'fa' ? 'پروژه قبلی' : 'Previous Project'}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold text-white">
                    {t(prev.title)}
                  </div>
                </div>
                <BackArrow className="w-5 h-5 text-[#55FF8A] shrink-0" />
              </Link>
            )}
            {next && (
              <Link
                to={`/projects/${next.slug}`}
                className="rounded-2xl border border-white/12 bg-[#0B0F16] p-5 hover:border-[#55FF8A]/45 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-mono-tech text-xs text-[#898F9D]">
                    {lang === 'fa' ? 'پروژه بعدی' : 'Next Project'}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold text-white">
                    {t(next.title)}
                  </div>
                </div>
                <NextArrow className="w-5 h-5 text-[#55FF8A] shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <SpacePortalCTA />
    </div>
  );
}
