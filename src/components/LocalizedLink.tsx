import React from 'react';
import { Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function localizePath(to: string, lang: 'en' | 'fa') {
  if (to.startsWith('/admin')) return to;
  const [pathWithQuery, hash = ''] = to.split('#', 2);
  const [pathname, query = ''] = pathWithQuery.split('?', 2);
  const withoutLocale = pathname.replace(/^\/(fa|en)(?=\/|$)/, '') || '/';
  const localized = `/${lang}${withoutLocale === '/' ? '' : withoutLocale}`;
  return `${localized}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

export function LocalizedLink({ to, ...props }: Omit<LinkProps, 'to'> & { to: string }) {
  const { lang } = useLanguage();
  return <Link to={localizePath(to, lang)} {...props} />;
}

export function LocalizedNavLink({
  to,
  ...props
}: Omit<NavLinkProps, 'to'> & { to: string }) {
  const { lang } = useLanguage();
  return <NavLink to={localizePath(to, lang)} {...props} />;
}
