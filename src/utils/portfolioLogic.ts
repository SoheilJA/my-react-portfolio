import {
  Language,
  PortfolioProject,
  PortfolioStat,
} from '../data/portfolioData';

export interface ContactFormInput {
  name: string;
  phone: string;
  service: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

export function sortProjectsByNewest(
  projects: readonly PortfolioProject[],
): PortfolioProject[] {
  return [...projects].sort((left, right) => right.id - left.id);
}

export function filterProjects(
  projects: readonly PortfolioProject[],
  query = '',
  lang: Language = 'en'
): PortfolioProject[] {
  const normalizedQuery = query.trim().toLowerCase();

  return sortProjectsByNewest(projects).filter((project) => {
    if (!normalizedQuery) return true;

    const titleText = project.title[lang].toLowerCase();
    const altTitleText = project.title[lang === 'en' ? 'fa' : 'en'].toLowerCase();
    const techMatch = project.tech.some((t) => t.toLowerCase().includes(normalizedQuery));

    return (
      titleText.includes(normalizedQuery) ||
      altTitleText.includes(normalizedQuery) ||
      techMatch
    );
  });
}

export function getProjectBySlug(
  projects: PortfolioProject[],
  slug: string | undefined
): PortfolioProject | undefined {
  if (!slug) return undefined;
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(
  projects: readonly PortfolioProject[],
  slug: string
): { prev: PortfolioProject | null; next: PortfolioProject | null } {
  const newestFirst = sortProjectsByNewest(projects);
  const index = newestFirst.findIndex((p) => p.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }
  const prev = index > 0 ? newestFirst[index - 1] : newestFirst[newestFirst.length - 1];
  const next = index < newestFirst.length - 1 ? newestFirst[index + 1] : newestFirst[0];
  return { prev, next };
}

export function toPersianDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/\d/g, (digit) => persianDigits[Number(digit)]);
}

export function formatStatValue(
  stat: PortfolioStat,
  counts: { projects: number; certificates: number; services: number },
  lang: Language
): string {
  let raw = 0;
  if (stat.auto === 'projects') raw = counts.projects;
  else if (stat.auto === 'certificates') raw = counts.certificates;
  else if (stat.auto === 'services') raw = counts.services;
  else raw = stat.value ?? 0;

  const formattedNumber = lang === 'fa' ? toPersianDigits(raw) : String(raw);
  return `${formattedNumber}${stat.suffix}`;
}

export function validateContactForm(
  input: ContactFormInput,
  lang: Language
): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name =
      lang === 'fa'
        ? 'لطفاً نام خود را (حداقل ۲ حرف) وارد کنید.'
        : 'Please enter your name (at least 2 characters).';
  }

  const phoneDigits = input.phone
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\D/g, '');
  const allowedPhoneCharacters = /^[+\d\s().\-۰-۹٠-٩]+$/;
  if (
    !allowedPhoneCharacters.test(input.phone.trim()) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    errors.phone =
      lang === 'fa'
        ? 'لطفاً شماره تماس معتبری با ۷ تا ۱۵ رقم وارد کنید.'
        : 'Please enter a valid phone number with 7 to 15 digits.';
  }

  if (!input.service.trim()) {
    errors.service =
      lang === 'fa'
        ? 'لطفاً نوع خدمت مورد نیاز را انتخاب کنید.'
        : 'Please select a service type.';
  }

  if (!input.message.trim() || input.message.trim().length < 10) {
    errors.message =
      lang === 'fa'
        ? 'لطفاً توضیح کوتاهی درباره پروژه (حداقل ۱۰ حرف) بنویسید.'
        : 'Please write a short project note (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
