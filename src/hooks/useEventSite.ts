import { createContext, useContext } from 'react';
import type { Conference } from '@/types';

/** The conference whose event site is being viewed, and the base address of that site (e.g. /event/icicgb-26). */
export type EventSite = { conference: Conference; base: string };

export const EventSiteContext = createContext<EventSite | null>(null);

/** The current event site, or null on the organisation site. */
export const useEventSite = () => useContext(EventSiteContext);

/**
 * Maps a page address to the right site. On an event site, '/registration' becomes that conference's own
 * registration page (/event/<slug>/registration) and '/' its event home; on the organisation site paths are unchanged.
 */
export function useSitePath() {
  const event = useEventSite();
  return (path: string) => (event ? (path === '/' ? event.base : `${event.base}${path}`) : path);
}
