import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { sampleConferences } from '@/data/conferences.sample';
import type { Conference } from '@/types';

/**
 * Conference record as held by the admin demo. `details` keeps the form-only fields
 * (venue, description, deadlines…) that the public Conference type does not carry.
 * `addedInSession` marks records created or imported in this browser session: they have
 * no public page, because nothing is saved.
 */
export type AdminConference = Conference & {
  details?: Partial<Record<string, string>>;
  addedInSession?: boolean;
};

type AdminData = {
  conferences: AdminConference[];
  addConferences: (items: AdminConference[]) => void;
  updateConference: (id: string, item: AdminConference) => void;
  removeConference: (id: string) => void;
};

const AdminDataContext = createContext<AdminData | null>(null);

/**
 * Shared demo state for the admin area, so that a conference added, imported, edited or
 * deleted on one page shows on the others. Lives in memory only and resets on reload.
 */
export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [conferences, setConferences] = useState<AdminConference[]>(sampleConferences);

  const addConferences = useCallback((items: AdminConference[]) => setConferences((list) => [...items, ...list]), []);
  const updateConference = useCallback((id: string, item: AdminConference) => setConferences((list) => list.map((c) => (c.id === id ? item : c))), []);
  const removeConference = useCallback((id: string) => setConferences((list) => list.filter((c) => c.id !== id)), []);

  const value = useMemo(() => ({ conferences, addConferences, updateConference, removeConference }), [conferences, addConferences, updateConference, removeConference]);
  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside <AdminDataProvider>');
  return ctx;
}

/** URL-safe slug from a conference short form, e.g. "ICICGB-26" → "icicgb-26". */
export const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
