import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { eventNav } from '@/data/site';
import { getConference } from '@/services/conferences';
import { EventSiteContext } from '@/hooks/useEventSite';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollManager } from '@/components/layout/ScrollManager';
import { Container } from '@/components/ui/Container';
import { EventBrand, EventFooter, EventUtilityBar } from '@/components/event/EventChrome';
import { SubscribeButton } from '@/components/event/SubscribeButton';
import NotFoundPage from '@/pages/NotFoundPage';
import type { Conference } from '@/types';

/**
 * Each conference has its own event site at /event/<slug>, with the event header menu, event footer and
 * Quick Links described in Event Details page.docx. Pages inside it read the conference from EventSiteContext.
 */
export function EventSiteLayout() {
  const { slug = '' } = useParams();
  const [conference, setConference] = useState<Conference | null | undefined>(null);

  useEffect(() => {
    let live = true;
    setConference(null);
    getConference(slug).then((c) => live && setConference(c));
    return () => {
      live = false;
    };
  }, [slug]);

  // Unknown conference: show the organisation site's "not found" page.
  if (conference === undefined)
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" className="flex-1">
          <NotFoundPage />
        </main>
        <Footer />
      </div>
    );

  if (conference === null)
    return (
      <Container className="py-24" aria-busy="true">
        <p className="text-muted">Loading conference…</p>
      </Container>
    );

  const base = `/event/${conference.slug}`;
  return (
    <EventSiteContext.Provider value={{ conference, base }}>
      <div className="flex min-h-dvh flex-col">
        <ScrollManager />
        <Header nav={eventNav(base)} homeTo={base} brand={<EventBrand conference={conference} base={base} />} utility={<EventUtilityBar base={base} />} />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <EventFooter conference={conference} base={base} />
        <SubscribeButton />
      </div>
    </EventSiteContext.Provider>
  );
}
