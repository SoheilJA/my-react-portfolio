import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolioContent } from '../context/PortfolioContentContext';
import {
  ContactFormInput,
  validateContactForm,
} from '../utils/portfolioLogic';
import { FourPointStarField } from '../components/WindscribeArtwork';

export function ContactPage() {
  const { lang, t } = useLanguage();
  const { content } = usePortfolioContent();
  const {
    assets: ARTWORK_ASSETS,
    profile: PORTFOLIO_PROFILE,
    services: PORTFOLIO_SERVICES,
  } = content;
  const [searchParams] = useSearchParams();

  const initialServiceSlug = searchParams.get('service') || '';
  const matchedService = PORTFOLIO_SERVICES.find(
    (s) => s.slug === initialServiceSlug
  );

  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    phone: '',
    service: matchedService ? matchedService.slug : '',
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [submittedData, setSubmittedData] = useState<ContactFormInput | null>(
    null
  );
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (matchedService) {
      setFormData((prev) =>
        prev.service ? prev : { ...prev, service: matchedService.slug }
      );
    }
  }, [matchedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactForm(formData, lang);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmittedData({ ...formData });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  const getServiceLabel = (slug: string) => {
    const found = PORTFOLIO_SERVICES.find((s) => s.slug === slug);
    return found ? t(found.title) : slug;
  };

  return (
    <div className="bg-[#090E19]">
      {/* Hero Banner with Portal Art Backdrop */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/10">
        <img
          loading="lazy"
          decoding="async"
          src={ARTWORK_ASSETS.contactPortal}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090E19]/80 via-[#090E19]/75 to-[#090E19]"
          aria-hidden="true"
        />
        <FourPointStarField />

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'fa'
                  ? 'ارتباط مستقیم و مشاوره پروژه'
                  : 'DIRECT PROJECT INQUIRY'}
              </span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06] [text-wrap:balance]">
              {t(content.pageCopy.contactHeading)}
            </h1>

            <p className="mt-4 text-base md:text-lg text-[#C2C8D4] leading-relaxed">
              {t(content.pageCopy.contactDescription)}
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 md:py-20 bg-[#070E17]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            {/* Inquiry Form */}
            <div className="lg:col-span-7 rounded-2xl border border-white/14 bg-[#0B0F16] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              {submittedData ? (
                <div className="py-6">
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-[#102928] px-4 py-2 text-xs font-bold text-[#55FF8A]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {lang === 'fa'
                        ? 'پیام شما با موفقیت ثبت شد'
                        : 'INQUIRY RECEIVED'}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-2xl md:text-3xl font-black text-white">
                    {lang === 'fa'
                      ? `ممنون ${submittedData.name}، درخواست شما آماده ارسال است.`
                      : `Thank you, ${submittedData.name}. Your brief is logged.`}
                  </h2>

                  <p className="mt-3 text-sm text-[#C2C8D4] leading-relaxed">
                    {lang === 'fa'
                      ? 'برای ارسال سریع‌تر، متن درخواست را با دکمهٔ ایمیل مستقیم باز کنید. برای پیگیری، از شمارهٔ تماسی که وارد کرده‌اید استفاده می‌کنم.'
                      : 'Open the pre-filled brief in your email app below. I’ll follow up using the phone number you provided.'}
                  </p>

                  <div className="mt-6 rounded-xl border border-white/10 bg-[#090E19] p-5 space-y-3 text-sm">
                    <div className="flex flex-wrap justify-between gap-2 border-b border-white/8 pb-2.5">
                      <span className="text-[#898F9D]">
                        {lang === 'fa' ? 'سرویس انتخاب‌شده:' : 'Selected Service:'}
                      </span>
                      <span className="font-semibold text-[#55FF8A]">
                        {getServiceLabel(submittedData.service)}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2 border-b border-white/8 pb-2.5">
                      <span className="text-[#898F9D]">
                        {lang === 'fa' ? 'شماره تماس:' : 'Contact Phone:'}
                      </span>
                      <span className="font-mono-tech text-white" dir="ltr">
                        {submittedData.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#898F9D] block mb-1">
                        {lang === 'fa' ? 'توضیحات پروژه:' : 'Project Note:'}
                      </span>
                      <p className="text-[#C2C8D4] leading-relaxed">
                        {submittedData.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <a
                      href={`mailto:${PORTFOLIO_PROFILE.email}?subject=${encodeURIComponent(
                        `Project Inquiry: ${getServiceLabel(submittedData.service)} — ${submittedData.name}`
                      )}&body=${encodeURIComponent(
                        `Name: ${submittedData.name}\nPhone: ${submittedData.phone}\nService: ${getServiceLabel(submittedData.service)}\n\n${submittedData.message}`
                      )}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#55FF8A] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#6EFF9B] transition-colors whitespace-nowrap"
                    >
                      <Mail className="w-4 h-4" />
                      <span>
                        {lang === 'fa' ? 'ارسال با ایمیل' : 'OPEN IN EMAIL APP'}
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedData(null);
                        setFormData({
                          name: '',
                          phone: '',
                          service: '',
                          message: '',
                        });
                      }}
                      className="rounded-full border border-white/15 bg-[#090E19] px-6 py-3.5 text-xs font-bold text-white hover:border-[#55FF8A] hover:text-[#55FF8A] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {lang === 'fa' ? 'ارسال پیام جدید' : 'Send Another Brief'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">
                      {lang === 'fa'
                        ? 'ثبت درخواست همکاری'
                        : 'Tell Me About Your Project'}
                    </h2>
                    <p className="mt-1 text-sm text-[#898F9D]">
                      {lang === 'fa'
                        ? 'تمامی فیلدها برای برآورد دقیق‌تر مورد نیاز هستند.'
                        : 'All fields are required so I can respond with a relevant architecture plan.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-bold uppercase tracking-wider text-[#C2C8D4] mb-2"
                      >
                        {lang === 'fa' ? 'نام و نام خانوادگی' : 'Your Name'}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        aria-invalid={Boolean(errors.name)}
                        placeholder={
                          lang === 'fa' ? 'مثلاً علی رضایی' : 'Alex Mercer'
                        }
                        className={`w-full rounded-xl border bg-[#090E19] px-4 py-3 text-sm text-white placeholder-[#898F9D]/70 focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-red-400 focus:border-red-400'
                            : 'border-white/15 focus:border-[#55FF8A]'
                        }`}
                      />
                      {errors.name && (
                        <p role="alert" className="mt-1.5 text-xs text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-bold uppercase tracking-wider text-[#C2C8D4] mb-2"
                      >
                        {lang === 'fa' ? 'شماره تماس' : 'Phone Number'}
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        dir="ltr"
                        autoComplete="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        aria-invalid={Boolean(errors.phone)}
                        placeholder="+98 901 234 5678"
                        className={`w-full rounded-xl border bg-[#090E19] px-4 py-3 text-sm text-white placeholder-[#898F9D]/70 focus:outline-none transition-colors ${
                          errors.phone
                            ? 'border-red-400 focus:border-red-400'
                            : 'border-white/15 focus:border-[#55FF8A]'
                        }`}
                      />
                      {errors.phone && (
                        <p role="alert" className="mt-1.5 text-xs text-red-400">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-service"
                      className="block text-xs font-bold uppercase tracking-wider text-[#C2C8D4] mb-2"
                    >
                      {lang === 'fa' ? 'نوع خدمت' : 'Project Type / Service'}
                    </label>
                    <select
                      id="contact-service"
                      value={formData.service}
                      onChange={(e) => {
                        setFormData({ ...formData, service: e.target.value });
                        if (errors.service)
                          setErrors({ ...errors, service: undefined });
                      }}
                      aria-invalid={Boolean(errors.service)}
                      className={`w-full rounded-xl border bg-[#090E19] px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                        errors.service
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-white/15 focus:border-[#55FF8A]'
                      }`}
                    >
                      <option value="">
                        {lang === 'fa'
                          ? 'یک خدمت را انتخاب کنید...'
                          : 'Select a service...'}
                      </option>
                      {PORTFOLIO_SERVICES.map((service) => (
                        <option key={service.id} value={service.slug}>
                          {t(service.title)}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p role="alert" className="mt-1.5 text-xs text-red-400">
                        {errors.service}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-bold uppercase tracking-wider text-[#C2C8D4] mb-2"
                    >
                      {lang === 'fa'
                        ? 'توضیحات کوتاه درباره پروژه'
                        : 'Project Brief & Timeline'}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message)
                          setErrors({ ...errors, message: undefined });
                      }}
                      aria-invalid={Boolean(errors.message)}
                      placeholder={
                        lang === 'fa'
                          ? 'درباره هدف سایت، امکانات مورد نظر یا لینک مرجع بنویسید...'
                          : 'Share your goals, key features (Django, Laravel, or WordPress), and ideal launch timeline...'
                      }
                      className={`w-full rounded-xl border bg-[#090E19] px-4 py-3 text-sm text-white placeholder-[#898F9D]/70 focus:outline-none transition-colors resize-y ${
                        errors.message
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-white/15 focus:border-[#55FF8A]'
                      }`}
                    />
                    {errors.message && (
                      <p role="alert" className="mt-1.5 text-xs text-red-400">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#55FF8A] px-9 py-4 text-xs font-extrabold uppercase tracking-wider text-black shadow-[0_0_28px_rgba(85,255,138,0.3)] hover:bg-[#6EFF9B] hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {lang === 'fa' ? 'ارسال درخواست پروژه' : 'SEND PROJECT BRIEF'}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Channels Panel */}
            <aside className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-white/14 bg-[#0B0F16] p-6 md:p-7">
                <div className="font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
                  {lang === 'fa' ? 'راه‌های ارتباطی مستقیم' : 'DIRECT CHANNELS'}
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">
                  {t(PORTFOLIO_PROFILE.name)}
                </h2>
                <p className="mt-1 text-sm text-[#898F9D]">
                  {t(PORTFOLIO_PROFILE.role)}
                </p>

                <div className="mt-6 space-y-4">
                  {/* Email with Copy */}
                  <div className="rounded-xl border border-white/10 bg-[#090E19] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#898F9D]">
                        <Mail className="w-3.5 h-3.5 text-[#55FF8A]" />
                        <span>{lang === 'fa' ? 'ایمیل' : 'Email'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#0B0F16] px-2.5 py-1 text-[11px] font-bold text-[#C2C8D4] hover:border-[#55FF8A] hover:text-[#55FF8A] transition-colors cursor-pointer"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3 h-3 text-[#55FF8A]" />
                            <span className="text-[#55FF8A]">
                              {lang === 'fa' ? 'کپی شد' : 'Copied'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{lang === 'fa' ? 'کپی' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <a
                      href={`mailto:${PORTFOLIO_PROFILE.email}`}
                      dir="ltr"
                      className="mt-2 block font-mono-tech text-sm text-white hover:text-[#55FF8A] transition-colors break-all"
                    >
                      {PORTFOLIO_PROFILE.email}
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="rounded-xl border border-white/10 bg-[#090E19] p-4">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#898F9D]">
                      <Phone className="w-3.5 h-3.5 text-[#55FF8A]" />
                      <span>{lang === 'fa' ? 'تلفن تماس' : 'Phone'}</span>
                    </span>
                    <a
                      href={`tel:${PORTFOLIO_PROFILE.phone}`}
                      dir="ltr"
                      className="mt-2 block font-mono-tech text-base font-bold text-white hover:text-[#55FF8A] transition-colors"
                    >
                      {PORTFOLIO_PROFILE.phone}
                    </a>
                  </div>

                  {/* Location */}
                  <div className="rounded-xl border border-white/10 bg-[#090E19] p-4">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#898F9D]">
                      <MapPin className="w-3.5 h-3.5 text-[#55FF8A]" />
                      <span>{lang === 'fa' ? 'موقعیت' : 'Base'}</span>
                    </span>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {t(PORTFOLIO_PROFILE.location)}
                    </p>
                    <p className="mt-1 text-xs text-[#898F9D]">
                      {lang === 'fa'
                        ? 'همکاری ریموت و حضوری در ایران و پروژه‌های بین‌المللی'
                        : 'Available for remote and local collaborations worldwide'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Collaboration Summary */}
              <div className="rounded-2xl border border-[#55FF8A]/25 bg-[#0D1E21] p-6">
                <div className="font-mono-tech text-xs uppercase tracking-widest text-[#55FF8A]">
                  {t(PORTFOLIO_PROFILE.availability)}
                </div>
                <p className="mt-2.5 text-sm text-[#D6DCE6] leading-relaxed">
                  {lang === 'fa'
                    ? 'ارتباط مستقیم بدون واسطه: از طراحی ساختار اطلاعات و گرافیک تا پیاده‌سازی Django، Laravel یا WordPress و استقرار روی سرور.'
                    : 'Direct client workflow from wireframing and database design through Django, Laravel, or WordPress implementation and Docker deployment.'}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
