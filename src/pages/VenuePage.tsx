import { Link } from 'react-router-dom';
import { Building2, MapPinned, Plane } from 'lucide-react';
import { exampleVenue } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { Notice } from '@/components/ui/Notice';

/**
 * Tentative venue. The client document supplies one EXAMPLE venue and notes that venues
 * will be managed from the dashboard per conference. The example is shown as such.
 */
export default function VenuePage() {
  usePageMeta('Tentative venue', 'Tentative venue details for ICF conferences.');
  return (
    <>
      <PageHeader title="Tentative venue" crumbs={[{ label: 'Conference information' }, { label: 'Tentative venue' }]} intro="Venue details are confirmed for each conference and published here and on the conference page." />
      <EventInfoLayout>
        <Notice tone="sample" title="Example venue from the client brief">
          The venue below is the example supplied in the Tentative Venue document. In Phase 2, each conference's venue will be managed from the admin dashboard.
        </Notice>

        <section aria-labelledby="venue-h" className="mt-8 grid overflow-hidden rounded-[var(--radius-lg)] border border-rule md:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-10">
            <Building2 aria-hidden className="size-9 text-gold-500" strokeWidth={1.4} />
            <h2 id="venue-h" className="mt-5 text-sm font-semibold text-muted">
              Tentative venue details
            </h2>
            <address className="mt-2 not-italic">
              <span className="block font-serif text-[2rem] font-semibold leading-tight text-navy-900">{exampleVenue.name}</span>
              <span className="mt-4 block space-y-0.5 text-lg leading-relaxed text-ink/85">
                {exampleVenue.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </address>
          </div>
          {/* Map placeholder: no map embed until the venue is confirmed */}
          <div className="relative flex min-h-64 flex-col items-center justify-center gap-3 bg-navy-900 p-8 text-center text-white">
            <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden>
              <defs>
                <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M28 0H0V28" fill="none" stroke="#fff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <MapPinned aria-hidden className="relative size-10 text-gold-300" strokeWidth={1.4} />
            <p className="relative max-w-[16rem] text-white/80">The location map will appear here once the conference venue is confirmed.</p>
          </div>
        </section>

        <section aria-labelledby="plan-h" className="mt-14 flex flex-col gap-4 rounded-[var(--radius-lg)] bg-mist p-6 sm:flex-row sm:items-center sm:p-8">
          <Plane aria-hidden className="size-8 shrink-0 text-globe-600" strokeWidth={1.4} />
          <div className="flex-1">
            <h2 id="plan-h" className="text-h3">
              Planning your trip
            </h2>
            <p className="mt-1 text-muted">Participants arrange their own visa, travel and accommodation. Read the guidance before you book.</p>
          </div>
          <Link to="/travel" className="font-semibold text-globe-700 hover:underline">
            Travel information
          </Link>
        </section>
      </EventInfoLayout>
    </>
  );
}
