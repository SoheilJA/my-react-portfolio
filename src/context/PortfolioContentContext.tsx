import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PORTFOLIO_CONTENT,
  PortfolioContent,
} from '../data/portfolioData';

interface PortfolioContentContextValue {
  content: PortfolioContent;
  error: string | null;
  isLoading: boolean;
  reload: () => Promise<void>;
  setContent: React.Dispatch<React.SetStateAction<PortfolioContent>>;
}

const PortfolioContentContext = createContext<PortfolioContentContextValue | null>(null);

function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const document = value as Record<string, unknown>;
  return (
    !!document.profile &&
    typeof document.profile === 'object' &&
    Array.isArray(document.projects) &&
    Array.isArray(document.services) &&
    Array.isArray(document.certificates) &&
    Array.isArray(document.skills) &&
    Array.isArray(document.experience) &&
    !!document.pageCopy &&
    typeof document.pageCopy === 'object' &&
    Array.isArray(document.stats) &&
    Array.isArray(document.paths) &&
    Array.isArray(document.technologies) &&
    !!document.assets &&
    typeof document.assets === 'object'
  );
}

export function PortfolioContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_PORTFOLIO_CONTENT);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content', { credentials: 'same-origin' });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(result?.error || `Content request failed (${response.status}).`);
      }
      const result: unknown = await response.json();
      if (!isPortfolioContent(result)) {
        throw new Error('The server returned an invalid portfolio content document.');
      }
      setContent(result);
      setError(null);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : 'Could not load site content.';
      setError(message);
      console.error('Could not load portfolio content:', loadError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo(
    () => ({ content, error, isLoading, reload, setContent }),
    [content, error, isLoading, reload],
  );

  return (
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContentContext);
  if (!context) {
    throw new Error('usePortfolioContent must be used within a PortfolioContentProvider.');
  }
  return context;
}
