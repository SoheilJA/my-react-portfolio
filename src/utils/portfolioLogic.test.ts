import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PORTFOLIO_CERTIFICATES,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_SERVICES,
  PORTFOLIO_STATS,
} from '../data/portfolioData';
import {
  filterProjects,
  formatStatValue,
  getAdjacentProjects,
  getProjectBySlug,
  sortProjectsByNewest,
  toPersianDigits,
  validateContactForm,
} from './portfolioLogic';

test('filterProjects filters by category and search query accurately', () => {
  const all = filterProjects(PORTFOLIO_PROJECTS, 'all', '', 'en');
  assert.equal(all.length, PORTFOLIO_PROJECTS.length);

  const codeOnly = filterProjects(PORTFOLIO_PROJECTS, 'code', '', 'en');
  assert.ok(codeOnly.length > 0);
  assert.ok(codeOnly.every((p) => p.category === 'code'));

  const wpOnly = filterProjects(PORTFOLIO_PROJECTS, 'wordpress', '', 'en');
  assert.ok(wpOnly.length > 0);
  assert.ok(wpOnly.every((p) => p.category === 'wordpress'));

  const djangoSearch = filterProjects(PORTFOLIO_PROJECTS, 'all', 'django', 'en');
  assert.ok(djangoSearch.some((p) => p.slug === 'pixoria'));
  assert.ok(djangoSearch.some((p) => p.slug === 'phazldaru-holding'));
});

test('projects are ordered newest first without mutating the source array', () => {
  const projects = [
    { ...PORTFOLIO_PROJECTS[0], id: 1, slug: 'oldest' },
    { ...PORTFOLIO_PROJECTS[0], id: 3, slug: 'newest' },
    { ...PORTFOLIO_PROJECTS[0], id: 2, slug: 'middle' },
  ];

  assert.deepEqual(
    sortProjectsByNewest(projects).map((project) => project.slug),
    ['newest', 'middle', 'oldest'],
  );
  assert.deepEqual(
    filterProjects(projects, 'all').map((project) => project.slug),
    ['newest', 'middle', 'oldest'],
  );
  const adjacent = getAdjacentProjects(projects, 'middle');
  assert.equal(adjacent.prev?.slug, 'newest');
  assert.equal(adjacent.next?.slug, 'oldest');
  assert.equal(projects[0].slug, 'oldest');
});

test('getProjectBySlug and getAdjacentProjects resolve real projects cleanly', () => {
  const siyas = getProjectBySlug(PORTFOLIO_PROJECTS, 'siyas');
  assert.ok(siyas);
  assert.equal(siyas?.link, 'https://siyas-v2.soheilahmadijalal-sj1378.workers.dev/');

  const missing = getProjectBySlug(PORTFOLIO_PROJECTS, 'nonexistent-slug');
  assert.equal(missing, undefined);

  const adjacent = getAdjacentProjects(PORTFOLIO_PROJECTS, 'siyas');
  assert.ok(adjacent.prev);
  assert.ok(adjacent.next);
  assert.notEqual(adjacent.next?.slug, 'siyas');
});

test('formatStatValue computes dynamic counts and Persian numerals', () => {
  const counts = {
    projects: PORTFOLIO_PROJECTS.length,
    certificates: PORTFOLIO_CERTIFICATES.length,
    services: PORTFOLIO_SERVICES.length,
  };

  assert.equal(formatStatValue(PORTFOLIO_STATS[0], counts, 'en'), '3+');
  assert.equal(formatStatValue(PORTFOLIO_STATS[0], counts, 'fa'), '۳+');
  assert.equal(
    formatStatValue(PORTFOLIO_STATS[1], counts, 'en'),
    String(PORTFOLIO_PROJECTS.length)
  );
  assert.equal(
    formatStatValue(PORTFOLIO_STATS[1], counts, 'fa'),
    toPersianDigits(PORTFOLIO_PROJECTS.length)
  );
});

test('validateContactForm enforces valid fields in both EN and FA', () => {
  const invalid = validateContactForm(
    { name: 'A', phone: '123', service: '', message: 'short' },
    'en'
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.service);
  assert.ok(invalid.errors.message);

  const invalidFa = validateContactForm(
    { name: '', phone: 'x', service: '', message: '' },
    'fa'
  );
  assert.equal(invalidFa.valid, false);
  assert.ok(invalidFa.errors.phone?.includes('شماره تماس'));
  const phoneWithLetters = validateContactForm(
    {
      name: 'Client',
      phone: 'call-me-1234567',
      service: 'backend-django-laravel',
      message: 'A project brief long enough.',
    },
    'en'
  );
  assert.ok(phoneWithLetters.errors.phone);

  const valid = validateContactForm(
    {
      name: 'Soheil Client',
      phone: '+1 (415) 555-0132',
      service: 'backend-django-laravel',
      message: 'We need a custom Django marketplace platform.',
    },
    'en'
  );
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});

  const validPersianDigits = validateContactForm(
    {
      name: 'مشتری',
      phone: '۰۹۱۵۱۲۳۴۵۶۷',
      service: 'backend-django-laravel',
      message: 'یک فروشگاه اینترنتی نیاز دارم.',
    },
    'fa'
  );
  assert.equal(validPersianDigits.valid, true);
});
