import { useState } from 'react';
import { Camera, ImageOff } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

/**
 * Gallery. Source document: "Galary will update soon"; photos are to be uploaded via the dashboard.
 * No stock imagery is used here, because it would be mistaken for real ICF event photographs.
 * The layout (filters + masonry grid) is ready for real albums.
 */
const filters = ['All photographs', 'Keynote sessions', 'Paper presentations', 'Award ceremonies', 'Networking'];
const frames = ['row-span-2', '', '', 'row-span-2', '', '', '', 'row-span-2', ''];

export default function GalleryPage() {
  usePageMeta('Gallery', 'Photographs from International Conference Forum (ICF) conferences.');
  const [active, setActive] = useState(filters[0]);
  return (
    <>
      <PageHeader title="Gallery" crumbs={[{ label: 'Gallery' }]} intro="Photographs from ICF conferences, keynote sessions, paper presentations and award ceremonies." />
      <Container className="py-14">
        <div role="tablist" aria-label="Gallery categories" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={f === active}
              onClick={() => setActive(f)}
              className={cn('rounded-full border px-4 py-2 text-sm font-semibold', f === active ? 'border-navy-900 bg-navy-900 text-white' : 'border-rule text-navy-900 hover:border-navy-900')}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative mt-8">
          <ul aria-hidden className="grid grid-flow-dense auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-3">
            {frames.map((span, i) => (
              <li key={i} className={cn('flex items-center justify-center rounded-[var(--radius-md)] border border-dashed border-navy-100 bg-mist', span)}>
                <Camera className="size-6 text-navy-100" strokeWidth={1.4} />
              </li>
            ))}
          </ul>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/30 via-white/85 to-white/30 p-6">
            <div className="max-w-md rounded-[var(--radius-lg)] border border-rule bg-white p-8 text-center shadow-[var(--shadow-panel)]">
              <ImageOff aria-hidden className="mx-auto size-10 text-gold-500" strokeWidth={1.3} />
              <h2 className="mt-4 text-h3">Gallery will be updated soon</h2>
              <p className="mt-2 text-muted">Photographs from ICF conferences will be published here as events take place.</p>
              <ButtonLink to="/conferences" className="mt-6">
                See upcoming conferences
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
