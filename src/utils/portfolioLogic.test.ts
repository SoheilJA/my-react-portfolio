import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PORTFOLIO_CERTIFICATES,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_SERVICES,
  PORTFOLIO_STATS,
  createProjectSlug,
  getProjectCategory,
  PROJECT_CATEGORIES,
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

test('filterProjects searches both project titles and technologies without descriptions', () => {
  const all = filterProjects(PORTFOLIO_PROJECTS, '', 'en');
  assert.equal(all.length, PORTFOLIO_PROJECTS.length);

  const djangoSearch = filterProjects(PORTFOLIO_PROJECTS, 'django', 'en');
  assert.ok(djangoSearch.some((p) => p.slug === 'pixoria'));
  assert.ok(djangoSearch.some((p) => p.slug === 'phazldaru-holding'));

  assert.deepEqual(
    filterProjects(PORTFOLIO_PROJECTS, '  PIXORIA  ', 'fa').map((p) => p.slug),
    ['pixoria'],
  );
  assert.deepEqual(
    filterProjects(PORTFOLIO_PROJECTS, 'پیکسوریا', 'en').map((p) => p.slug),
    ['pixoria'],
  );
});

test('createProjectSlug builds URL-safe English and Persian title slugs', () => {
  assert.equal(createProjectSlug('  My Great Project!  '), 'my-great-project');
  assert.equal(createProjectSlug('نمونه‌کار من'), 'نمونه-کار-من');
});

test('default projects use their English titles as slugs and keep only project fields', () => {
  for (const project of PORTFOLIO_PROJECTS) {
    assert.equal(project.slug, createProjectSlug(project.title.en));
    assert.deepEqual(
      Object.keys(project).sort(),
      ['category', 'id', 'image', 'link', 'slug', 'tech', 'title'].sort(),
    );
    assert.ok(PROJECT_CATEGORIES.some((category) => category.value === project.category));
  }
});

test('legacy projects receive a category from their existing technologies', () => {
  assert.equal(getProjectCategory({ tech: [' WordPress ', 'Elementor'] }), 'wordpress');
  assert.equal(getProjectCategory({ tech: ['WORDPRESS'] }), 'wordpress');
  assert.equal(getProjectCategory({ tech: ['Django', 'Python'] }), 'programming');
  assert.equal(getProjectCategory({ category: 'custom-code', tech: ['Laravel'] }), 'programming');
  assert.equal(getProjectCategory({ tech: [] }), 'programming');
});

test('explicit project categories remain unchanged when technologies differ', () => {
  assert.equal(getProjectCategory({ category: 'programming', tech: ['WordPress'] }), 'programming');
  assert.equal(getProjectCategory({ category: 'wordpress', tech: ['PHP'] }), 'wordpress');
});

test('importable content preserves the canonical project fields and values', () => {
  const exportedContent = JSON.parse(
    readFileSync(new URL('../../site-content-export.json', import.meta.url), 'utf8'),
  );
  assert.deepEqual(exportedContent.projects, PORTFOLIO_PROJECTS);
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
    filterProjects(projects).map((project) => project.slug),
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
