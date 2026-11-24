import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Settings2,
  Sparkles,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import { DEFAULT_PORTFOLIO_CONTENT, PortfolioContent } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type SectionKey = keyof PortfolioContent;

const sections: {
  key: SectionKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'profile', title: 'پروفایل', description: 'معرفی، راه‌های ارتباطی و اطلاعات شخصی', icon: UserRound },
  { key: 'pageCopy', title: 'متن صفحات', description: 'تیترها و متن‌های اصلی صفحه‌های سایت در هر دو زبان', icon: FileText },
  { key: 'projects', title: 'پروژه‌ها', description: 'نمونه‌کارها، جزئیات و لینک‌های پروژه', icon: FolderKanban },
  { key: 'services', title: 'خدمات', description: 'خدمات قابل ارائه و موارد تحویل', icon: Wrench },
  { key: 'experience', title: 'سوابق کاری', description: 'تجربه‌ها و مسیر حرفه‌ای', icon: BriefcaseBusiness },
  { key: 'certificates', title: 'گواهی‌نامه‌ها', description: 'مدارک، توضیحات و لینک استعلام', icon: Award },
  { key: 'skills', title: 'مهارت‌ها', description: 'گروه‌های مهارتی و ابزارها', icon: Sparkles },
  { key: 'paths', title: 'مسیرهای تخصصی', description: 'حوزه‌های کاری نمایش‌داده‌شده در خانه', icon: FileText },
  { key: 'stats', title: 'آمار صفحهٔ اصلی', description: 'شاخص‌هایی که در نوار آمار نمایش داده می‌شوند', icon: LayoutDashboard },
  { key: 'technologies', title: 'فناوری‌ها', description: 'فهرست فناوری‌های نوار متحرک', icon: Settings2 },
  { key: 'assets', title: 'تصاویر سایت', description: 'آدرس تصاویر پس‌زمینه و آثار گرافیکی', icon: Images },
];

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function replaceAtPath<T>(
  root: T,
  path: (string | number)[],
  nextValue: JsonValue,
): T {
  if (path.length === 0) return nextValue as T;
  const [head, ...tail] = path;
  if (Array.isArray(root) && typeof head === 'number') {
    const updated = root.slice();
    updated[head] = replaceAtPath(updated[head], tail, nextValue);
    return updated as T;
  }
  if (isRecord(root) && typeof head === 'string') {
    return {
      ...root,
      [head]: replaceAtPath(root[head], tail, nextValue),
    } as T;
  }
  return root;
}

function emptyLike(value: JsonValue, field = ''): JsonValue {
  if (Array.isArray(value)) return [];
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        key === 'id' ? Date.now() : emptyLike(child, key),
      ]),
    ) as JsonValue;
  }
  if (typeof value === 'number') return field === 'id' ? Date.now() : 0;
  if (typeof value === 'boolean') return false;
  return '';
}

function itemLabel(value: JsonValue, index: number, title: string) {
  if (isRecord(value)) {
    for (const key of ['title', 'name', 'company']) {
      const field = value[key];
      if (isRecord(field)) {
        const label = field.fa || field.en;
        if (typeof label === 'string' && label.trim()) return label;
      } else if (typeof field === 'string' && field.trim()) {
        return field;
      }
    }
    if (typeof value.slug === 'string' && value.slug) return value.slug;
  }
  return `${title} ${index + 1}`;
}

function fieldTitle(key: string) {
  const labels: Record<string, string> = {
    en: 'English',
    fa: 'فارسی',
    bio: 'بیوگرافی',
    extraCraft: 'معرفی کوتاه',
    email: 'ایمیل',
    phone: 'تلفن',
    name: 'نام',
    shortName: 'نام کوتاه',
    role: 'عنوان شغلی',
    location: 'موقعیت',
    availability: 'وضعیت همکاری',
    title: 'عنوان',
    desc: 'توضیحات',
    summary: 'خلاصه',
    architectureNote: 'توضیح فنی',
    sector: 'حوزه',
    link: 'لینک',
    image: 'آدرس تصویر',
    year: 'سال',
    tech: 'فناوری‌ها',
    stack: 'تکنولوژی‌ها',
    slug: 'شناسهٔ آدرس',
    category: 'دسته‌بندی',
    featured: 'پروژهٔ منتخب',
    deliverables: 'موارد تحویل',
    artVariant: 'نوع تصویرسازی',
    period: 'دوره',
    company: 'شرکت',
    points: 'دستاوردها',
    tag: 'نوع همکاری',
    milestone: 'دستاورد اصلی',
    issuer: 'صادرکننده',
    credentialCode: 'کد مدرک',
    focus: 'موضوع مدرک',
    items: 'موارد',
    value: 'مقدار',
    auto: 'محاسبهٔ خودکار',
    suffix: 'پسوند',
    label: 'عنوان شاخص',
    text: 'متن',
  };
  if (labels[key]) return labels[key];
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function JsonEditor({
  label,
  value,
  path,
  onChange,
  newItemTemplate,
}: {
  label: string;
  value: JsonValue;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
  newItemTemplate?: JsonValue;
}) {
  if (Array.isArray(value)) {
    const template = value[0] ?? newItemTemplate ?? '';
    const objectItems = value.some((item) => isRecord(item) || Array.isArray(item));
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange(path, [...value, emptyLike(template)])
            }
          >
            <Plus className="h-4 w-4" />
            افزودن مورد
          </Button>
        </div>
        {value.length === 0 && (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            هنوز موردی ثبت نشده است.
          </p>
        )}
        {value.map((item, index) => {
          const itemPath = [...path, index];
          const remove = () => onChange(path, value.filter((_, itemIndex) => itemIndex !== index));
          if (objectItems && isRecord(item)) {
            return (
              <details key={index} className="group rounded-lg border bg-background">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                  <span className="min-w-0 truncate text-sm font-medium">
                    {itemLabel(item, index, label)}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="outline">ویرایش</Badge>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </div>
                </summary>
                <div className="space-y-5 border-t p-4">
                  <JsonEditor
                    label={itemLabel(item, index, label)}
                    value={item}
                    path={itemPath}
                    onChange={onChange}
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={remove}>
                    <X className="h-4 w-4" />
                    حذف مورد
                  </Button>
                </div>
              </details>
            );
          }
          return (
            <div key={index} className="flex items-center gap-2">
              <Input
                aria-label={`${label} ${index + 1}`}
                value={typeof item === 'string' || typeof item === 'number' ? item : ''}
                onChange={(event) =>
                  onChange(
                    itemPath,
                    typeof item === 'number' ? Number(event.target.value) : event.target.value,
                  )
                }
              />
              <Button type="button" variant="ghost" size="icon" aria-label="حذف مورد" onClick={remove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    );
  }

  if (isRecord(value)) {
    const entries = Object.entries(value);
    if (
      entries.length === 2 &&
      typeof value.en === 'string' &&
      typeof value.fa === 'string'
    ) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {(['fa', 'en'] as const).map((language) => {
            const translated = value[language];
            if (typeof translated !== 'string') return null;
            return (
              <label key={language} className="grid gap-2 text-sm font-medium">
                {language === 'fa' ? 'فارسی' : 'English'}
                {translated.length > 100 ? (
                  <Textarea
                    dir={language === 'fa' ? 'rtl' : 'ltr'}
                    value={translated}
                    onChange={(event) =>
                      onChange([...path, language], event.target.value)
                    }
                  />
                ) : (
                  <Input
                    dir={language === 'fa' ? 'rtl' : 'ltr'}
                    value={translated}
                    onChange={(event) =>
                      onChange([...path, language], event.target.value)
                    }
                  />
                )}
              </label>
            );
          })}
        </div>
      );
    }

    return (
      <div className="grid gap-4 rounded-lg border bg-background/50 p-4 md:grid-cols-2">
        {entries.map(([key, child]) => (
          <div
            key={key}
            className={cn(
              'min-w-0',
              (Array.isArray(child) || isRecord(child)) && 'md:col-span-2',
            )}
          >
            <JsonEditor
              label={fieldTitle(key)}
              value={child}
              path={[...path, key]}
              onChange={onChange}
              newItemTemplate={
                path.length === 0 && Array.isArray(DEFAULT_PORTFOLIO_CONTENT[key as SectionKey])
                  ? ((DEFAULT_PORTFOLIO_CONTENT[key as SectionKey] as unknown as JsonValue[])[0] ?? '')
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex min-h-10 items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        {label}
      </label>
    );
  }

  const options =
    path[path.length - 1] === 'category'
      ? ['code', 'wordpress']
      : path[path.length - 1] === 'artVariant'
        ? ['backend', 'ecommerce', 'corporate', 'marketplace', 'portfolio', 'frontend', 'wordpress']
        : null;

  if (options) {
    return (
      <label className="grid gap-2 text-sm font-medium">
        {label}
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(path, event.target.value)}
        >
          <option value="">انتخاب کنید</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  const text = value === null ? '' : String(value);
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {text.length > 100 || path[path.length - 1] === 'bio' ? (
        <Textarea
          value={text}
          onChange={(event) => onChange(path, event.target.value)}
        />
      ) : (
        <Input
          type={typeof value === 'number' ? 'number' : 'text'}
          value={text}
          onChange={(event) =>
            onChange(
              path,
              typeof value === 'number' ? Number(event.target.value) : event.target.value,
            )
          }
        />
      )}
    </label>
  );
}

function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { authenticated?: boolean; error?: string };
      if (!response.ok || !result.authenticated) {
        throw new Error(result.error || 'ورود انجام نشد.');
      }
      onAuthenticated();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'ارتباط با سرور برقرار نشد.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main dir="rtl" className="admin-theme flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md border-border/70 bg-card">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Settings2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">ورود به پنل مدیریت</CardTitle>
          <CardDescription>برای ویرایش محتوای سایت وارد شوید.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={login} className="space-y-4">
            <label className="grid gap-2 text-sm font-medium">
              رمز عبور مدیر
              <Input
                autoComplete="current-password"
                autoFocus
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error && (
              <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              ورود امن
            </Button>
            <a href="/fa" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              بازگشت به سایت <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export function AdminPage() {
  const { content, setContent, error: contentError, isLoading, reload } = usePortfolioContent();
  const { lang } = useLanguage();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('profile');
  const [draft, setDraft] = useState<PortfolioContent>(content);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveHasError, setSaveHasError] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error('بررسی نشست مدیر ناموفق بود.');
        return (await response.json()) as { authenticated?: boolean };
      })
      .then((result) => {
        if (active) setAuthenticated(Boolean(result.authenticated));
      })
      .catch((sessionError: unknown) => {
        if (!active) return;
        setAuthError(
          sessionError instanceof Error ? sessionError.message : 'ارتباط با سرور برقرار نشد.',
        );
        setAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isDirty) setDraft(content);
  }, [content, isDirty]);

  const activeSectionInfo = sections.find((section) => section.key === activeSection)!;
  const counts = useMemo(
    () => [
      { label: 'پروژه‌ها', count: content.projects.length, icon: FolderKanban },
      { label: 'خدمات', count: content.services.length, icon: Wrench },
      { label: 'گواهی‌نامه‌ها', count: content.certificates.length, icon: Award },
      { label: 'سوابق کاری', count: content.experience.length, icon: BriefcaseBusiness },
    ],
    [content],
  );

  if (authenticated === null) {
    return (
      <main className="admin-theme flex min-h-screen items-center justify-center bg-background text-foreground" dir="rtl">
        <LoaderCircle className="h-7 w-7 animate-spin text-primary" />
      </main>
    );
  }

  if (!authenticated) {
    return (
      <>
        <LoginScreen onAuthenticated={() => { setAuthError(''); setAuthenticated(true); }} />
        {authError && (
          <div role="alert" className="fixed bottom-4 left-4 rounded-lg border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive" dir="rtl">
            {authError}
          </div>
        )}
      </>
    );
  }

  const save = async () => {
    setIsSaving(true);
    setSaveMessage('');
    setSaveHasError(false);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const result = (await response.json()) as { saved?: boolean; error?: string };
      if (!response.ok || !result.saved) {
        throw new Error(result.error || 'ذخیرهٔ محتوا انجام نشد.');
      }
      setContent(draft);
      setIsDirty(false);
      setSaveMessage('تغییرات با موفقیت در D1 ذخیره شد.');
      window.setTimeout(() => setSaveMessage(''), 4000);
    } catch (saveError) {
      setSaveHasError(true);
      setSaveMessage(
        saveError instanceof Error ? saveError.message : 'ارتباط با سرور برقرار نشد.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error('خروج از پنل ناموفق بود.');
      setAuthenticated(false);
    } catch (logoutError) {
      setAuthError(logoutError instanceof Error ? logoutError.message : 'خروج انجام نشد.');
    }
  };

  const changeField = (path: (string | number)[], value: JsonValue) => {
    setDraft((current) => replaceAtPath(current, path, value));
    setIsDirty(true);
  };

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground" dir="rtl">
      <div className="flex min-h-screen">
        <aside className="relative hidden w-64 shrink-0 border-l bg-card/60 p-4 lg:block">
          <a href={`/${lang}`} className="flex items-center gap-3 rounded-xl px-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">پنل مدیریت</p>
              <p className="text-xs text-muted-foreground">soheil-ja.ir</p>
            </div>
          </a>
          <div className="my-4 h-px bg-border" />
          <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground">مدیریت محتوا</p>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-sm transition-colors',
                    activeSection === section.key
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {section.title}
                  {activeSection === section.key && <ArrowUpRight className="mr-auto h-4 w-4" />}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-4 flex w-56 items-center gap-2 rounded-lg border bg-background p-3 text-xs text-muted-foreground">
            <CircleHelp className="h-4 w-4 shrink-0 text-primary" />
            ذخیرهٔ تغییرات در پایگاه دادهٔ D1
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden">
                <select
                  aria-label="انتخاب بخش"
                  value={activeSection}
                  onChange={(event) => setActiveSection(event.target.value as SectionKey)}
                  className="h-9 max-w-40 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {sections.map(({ key, title }) => <option key={key} value={key}>{title}</option>)}
                </select>
              </div>
              <span className="hidden text-sm text-muted-foreground sm:inline">مدیریت /</span>
              <span className="truncate text-sm font-semibold">{activeSectionInfo.title}</span>
              {isDirty && <Badge variant="outline" className="hidden sm:inline-flex">ذخیره‌نشده</Badge>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(`/${lang}`, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">نمایش سایت</span>
              </Button>
              <Button type="button" onClick={save} disabled={!isDirty || isSaving} size="sm">
                {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                ذخیره
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="خروج" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
            {activeSection === 'profile' && (
              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {counts.map(({ label, count, icon: Icon }) => (
                  <Card key={label} className="bg-card/70">
                    <CardContent className="flex items-center justify-between p-5">
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-1 text-2xl font-bold tabular-nums">{count}</p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Icon className="h-5 w-5" /></div>
                    </CardContent>
                  </Card>
                ))}
              </section>
            )}

            {contentError && (
              <div role="alert" className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
                <span>دریافت محتوا از API مشکل داشت: {contentError}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => void reload()}>
                  تلاش دوباره
                </Button>
              </div>
            )}
            {saveMessage && (
              <div role="status" className={cn(
                'flex items-center gap-2 rounded-lg border p-3 text-sm',
                saveHasError ? 'border-destructive/30 text-destructive' : 'border-primary/30 text-primary',
              )}>
                {saveMessage.includes('موفقیت') ? <Check className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}
                {saveMessage}
              </div>
            )}

            <Card className="border-border/70">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{activeSectionInfo.title}</CardTitle>
                  <CardDescription className="mt-2">{activeSectionInfo.description}</CardDescription>
                </div>
                <Badge variant="secondary">{isLoading ? 'در حال همگام‌سازی' : 'ذخیره در D1'}</Badge>
              </CardHeader>
              <CardContent>
                <JsonEditor
                  label={activeSectionInfo.title}
                  value={draft[activeSection] as unknown as JsonValue}
                  path={[activeSection]}
                  onChange={changeField}
                  newItemTemplate={
                    Array.isArray(DEFAULT_PORTFOLIO_CONTENT[activeSection])
                      ? ((DEFAULT_PORTFOLIO_CONTENT[activeSection] as unknown as JsonValue[])[0] ?? '')
                      : undefined
                  }
                />
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                  <p className="text-xs text-muted-foreground">
                    فیلدهای انگلیسی و فارسی را جداگانه ویرایش کنید. تغییرات پس از ذخیره روی هر دو زبان اعمال می‌شود.
                  </p>
                  <Button type="button" onClick={save} disabled={!isDirty || isSaving}>
                    {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    ذخیرهٔ تغییرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
