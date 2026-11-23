import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Client-supplied home page banners (folder "organization header slider"), shown in this order and repeated. */
const slides = [
  {
    name: 'home-slide-1',
    alt: 'International Conference Forum. Connecting Global Minds, Inspiring Innovation: a global hub for innovation and collaboration.',
  },
  {
    name: 'home-slide-2',
    alt: 'International Conference Forum: highlights of the conference.',
  },
  {
    name: 'home-slide-3',
    alt: 'International Conference Forum. Connect, Share, Advance: bringing researchers, professionals and innovators together for a better tomorrow.',
  },
];

const SLIDE_MS = 5000;

/** Running banner: each slide shows for five seconds, then fades into the next. */
export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setCurrent((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="relative mx-auto aspect-[3/1] w-full max-w-[1600px]" role="region" aria-roledescription="carousel" aria-label="ICF banners">
      {slides.map((s, i) => (
        <img
          key={s.name}
          src={`/images/${s.name}.webp`}
          srcSet={`/images/${s.name}-1100.webp 1100w, /images/${s.name}.webp 2172w`}
          sizes="(max-width: 1600px) 100vw, 1600px"
          width={2172}
          height={724}
          alt={s.alt}
          aria-hidden={i !== current}
          fetchPriority={i === 0 ? 'high' : undefined}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none',
            i === current ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}

      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-navy-950/45 px-1.5 py-0.5 sm:right-4 sm:top-4">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause banner' : 'Play banner'}
          className="grid size-6 place-items-center rounded-full text-white hover:bg-white/15"
        >
          {playing ? <Pause aria-hidden className="size-3" /> : <Play aria-hidden className="size-3" />}
        </button>
        {slides.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Show banner ${i + 1}`}
            aria-current={i === current}
            className="grid size-6 place-items-center"
          >
            <span className={cn('block size-2 rounded-full transition-colors', i === current ? 'bg-gold-400' : 'bg-white/70')} />
          </button>
        ))}
      </div>
    </div>
  );
}
