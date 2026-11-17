import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { peerReviewSteps } from '@/data/content';
import { cn } from '@/utils/cn';

/**
 * Peer Review Process: six-step connected timeline recreated from the client's reference artwork
 * ("ICF Peer Review Process Timeline.png"): navy / bright blue / cyan palette, numbered gradient markers
 * on a connecting line with white arrow connectors, white cards with coloured bottom edges (gold for Awards).
 *
 * Desktop (xl+): one row of six. Every size is expressed in the reference's own pixels times --u, so the row
 *   keeps the reference proportions at any width (1 reference px = 1 screen px at 1790px of content).
 * Tablet (md–xl): two rows of three. Mobile: vertical connected timeline.
 */

const NAVY = '#0b1f4f';
const BLUE = '#1667db';

/** Per-step colours: bottom edge, line segment to the next step, number marker. */
const steps = [
  { edge: 'linear-gradient(90deg,#1a73e8,#0b3a8c)', line: ['#1a73e8', '#22b8ee'], marker: 'linear-gradient(150deg,#2b86ec,#0a3d99)' },
  { edge: 'linear-gradient(90deg,#22c1ee,#1a6fe0)', line: ['#22b8ee', '#1a73e8'], marker: 'linear-gradient(150deg,#2b86ec,#0a3d99)' },
  { edge: 'linear-gradient(90deg,#7b4ff0,#2f6fe6)', line: ['#1a73e8', '#6d3fe6'], marker: 'linear-gradient(150deg,#2b86ec,#0a3d99)' },
  { edge: 'linear-gradient(90deg,#6d3fe6,#8d4ff0)', line: ['#6d3fe6', '#2f6fe6'], marker: 'linear-gradient(150deg,#4f6ff2,#1d2fa8)' },
  { edge: 'linear-gradient(90deg,#22b8ee,#1a5fd8)', line: ['#2f6fe6', '#1a73e8'], marker: 'linear-gradient(150deg,#2b86ec,#0a3d99)' },
  { edge: 'linear-gradient(90deg,#f7b733,#f59e0b)', line: ['#1a73e8', '#1a73e8'], marker: 'linear-gradient(150deg,#2b86ec,#0a3d99)' },
];

/* Custom 64×64 icons drawn to match the reference artwork (blue gradient, gold trophy). */
const G = 'url(#pr-g)';
const G_DARK = 'url(#pr-g-dark)';
const GOLD = 'url(#pr-gold)';
const line = { fill: 'none', stroke: G, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Scalloped (rosette) outline around (cx, cy). */
function rosettePath(cx: number, cy: number, rOuter: number, rInner: number, bumps: number) {
  const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  let d = '';
  for (let k = 0; k < bumps; k++) {
    const a0 = (k / bumps) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((k + 0.5) / bumps) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((k + 1) / bumps) * Math.PI * 2 - Math.PI / 2;
    if (k === 0) d += `M${p(rInner, a0)} `;
    d += `Q${p(rOuter * 1.08, a1)} ${p(rInner, a2)} `;
  }
  return d + 'Z';
}

function LaurelBranch() {
  // Stem curving up the left side, with leaves on both sides of it
  const leaves: [number, number, number][] = [
    [21, 57.5, -78],
    [15.5, 54.5, -62],
    [11, 49.5, -48],
    [8, 43.5, -32],
    [6.6, 37, -16],
    [6.6, 30.5, 0],
    [8, 24, 16],
  ];
  return (
    <g>
      <path d="M27 59 C13 56 4 44 7.5 21" {...line} strokeWidth={2.2} />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x - 3.4} cy={y} rx="3.6" ry="1.9" transform={`rotate(-28 ${x - 3.4} ${y})`} fill={G} />
          <ellipse cx={x + 3.4} cy={y - 0.6} rx="3.6" ry="1.9" transform={`rotate(28 ${x + 3.4} ${y - 0.6})`} fill={G} />
        </g>
      ))}
      <ellipse cx="8.8" cy="17.5" rx="2" ry="3.6" transform="rotate(20 8.8 17.5)" fill={G} />
    </g>
  );
}

function StepIcon({ index }: { index: number }) {
  const svg = (children: ReactNode, size = 'size-[68%]', viewBox = '0 0 64 64') => (
    <svg viewBox={viewBox} className={size} aria-hidden>
      {children}
    </svg>
  );
  switch (index) {
    case 0: // document with text lines and an upload arrow
      return svg(
        <>
          <path d="M40 57H17a4.5 4.5 0 0 1-4.5-4.5v-41A4.5 4.5 0 0 1 17 7h19l12 12v17" {...line} strokeWidth={3.6} />
          <path d="M36 7v8a4 4 0 0 0 4 4h8" {...line} strokeWidth={3.6} />
          <path d="M20.5 22h9M20.5 30h19M20.5 38h19M20.5 46h11" {...line} strokeWidth={3.6} />
          <path d="M49 60V42M42 48.5l7-7 7 7" {...line} strokeWidth={4.2} />
        </>,
      );
    case 1: // three people with a magnifying glass
      return svg(
        <>
          <circle cx="17" cy="17" r="6.5" fill={G} />
          <path d="M4 41a13 13 0 0 1 26 0v1.5H4z" fill={G} />
          <circle cx="45" cy="17" r="6.5" fill={G} />
          <path d="M32 41a13 13 0 0 1 26 0v1.5H32z" fill={G} />
          <circle cx="31" cy="21" r="8" fill={G} stroke="#ffffff" strokeWidth="2.5" />
          <path d="M14 50a17 17 0 0 1 34 0v3H14z" fill={G} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="45" cy="45" r="9.5" fill="#ffffff" stroke={G} strokeWidth="4.2" />
          <path d="M52 52l7.5 7.5" {...line} strokeWidth={5.5} />
        </>,
      );
    case 2: // clipboard with a checklist
      return svg(
        <>
          <rect x="12.5" y="10" width="39" height="50" rx="5" fill="#ffffff" stroke={G} strokeWidth="3.6" />
          <rect x="23" y="5" width="18" height="10.5" rx="3.5" fill="#ffffff" stroke={G} strokeWidth="3.6" />
          {[26, 37, 48].map((y) => (
            <g key={y}>
              <path d={`M19.5 ${y}l3.2 3.2 6-6.4`} {...line} strokeWidth={3.4} />
              <path d={`M33.5 ${y + 0.5}H45`} {...line} strokeWidth={3.6} />
            </g>
          ))}
        </>,
      );
    case 3: // two overlapping speech bubbles
      return svg(
        <>
          <path d="M29 25h22a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-2v8l-9-8H29a6 6 0 0 1-6-6V31a6 6 0 0 1 6-6z" {...line} fill="#ffffff" strokeWidth={3.6} />
          <path d="M13 8h26a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H22l-9 8v-8a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z" {...line} fill="#ffffff" strokeWidth={3.6} />
          <path d="M15.5 18h21M15.5 25.5h14" {...line} strokeWidth={3.6} />
        </>,
      );
    case 4: // rosette with a tick and two ribbons
      return svg(
        <>
          <path d="M21 36 14.5 58l8.2-3.6L27 62l6-22z" fill={G_DARK} />
          <path d="M43 36l6.5 22-8.2-3.6L37 62l-6-22z" fill={G_DARK} />
          <path d={rosettePath(32, 26, 23, 19.5, 14)} fill={G} />
          <circle cx="32" cy="26" r="13" fill="none" stroke="#ffffff" strokeWidth="2.6" />
          <path d="M25.5 26.5l4.6 4.6 8.6-9" fill="none" stroke="#ffffff" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        </>,
      );
    default: // gold trophy with a star, between two laurel branches
      return svg(
        <>
          {/* Laurels sit out at the sides; the trophy is the main element */}
          <g transform="translate(-6 2) scale(0.92)">
            <LaurelBranch />
          </g>
          <g transform="translate(70 2) scale(-0.92 0.92)">
            <LaurelBranch />
          </g>
          <g transform="translate(32 31) scale(1.08) translate(-32 -31)">
            <path d="M22 14h-5.5a5.5 5.5 0 0 0 0 11H22M42 14h5.5a5.5 5.5 0 0 1 0 11H42" fill="none" stroke="#e8a20c" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M20 9h24v13a12 12 0 0 1-24 0z" fill={GOLD} stroke="#d48806" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M32 12.8l1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="#ffffff" />
            <path d="M28.5 33.5h7l1 7.5h-9z" fill={GOLD} />
            <rect x="21" y="41" width="22" height="7" rx="2" fill={GOLD} stroke="#d48806" strokeWidth="1.2" />
            <rect x="18" y="47.5" width="28" height="5" rx="2" fill="#e8a20c" />
          </g>
        </>,
        'size-[86%]',
        '-7 0 78 64',
      );
  }
}

function Connector({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden className={cn('absolute z-30 items-center justify-center rounded-full bg-white text-[#0b2a6b] shadow-[0_4px_14px_-2px_rgba(20,70,160,0.3)]', className)}>
      {children}
    </span>
  );
}

export function PeerReviewTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setInView(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

  return (
    <section className="relative overflow-hidden bg-[#f5f8fe] py-16 lg:py-20" aria-labelledby="review-heading">
      {/* Soft curved background shapes, as in the reference */}
      <div aria-hidden className="pointer-events-none absolute -left-56 -top-48 h-[30rem] w-[52rem] -rotate-[18deg] rounded-[50%] bg-[radial-gradient(closest-side,#d8e6fb_0%,#e6eefc_60%,transparent_100%)] opacity-90" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-[18rem] w-[40rem] -rotate-[28deg] rounded-[50%] bg-[radial-gradient(closest-side,#ffffffcc,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-52 -right-48 h-[28rem] w-[50rem] rotate-[14deg] rounded-[50%] bg-[radial-gradient(closest-side,#dbe7fb_0%,#e9f0fc_60%,transparent_100%)]" />
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          {/* userSpaceOnUse (in the icons' 64x64 grid) so straight strokes like text lines still get the gradient */}
          <linearGradient id="pr-g" gradientUnits="userSpaceOnUse" x1="6" y1="4" x2="56" y2="60">
            <stop offset="0%" stopColor="#2f8ff2" />
            <stop offset="100%" stopColor="#0a3fa8" />
          </linearGradient>
          <linearGradient id="pr-g-dark" gradientUnits="userSpaceOnUse" x1="14" y1="36" x2="50" y2="62">
            <stop offset="0%" stopColor="#1f6fe0" />
            <stop offset="100%" stopColor="#0a2f86" />
          </linearGradient>
          <linearGradient id="pr-gold" gradientUnits="userSpaceOnUse" x1="20" y1="8" x2="44" y2="52">
            <stop offset="0%" stopColor="#ffd75e" />
            <stop offset="100%" stopColor="#f29d0b" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mx-auto max-w-[122rem] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 id="review-heading" className="font-serif font-[800] leading-[1.12] tracking-[-0.01em] text-[clamp(2rem,3.4vw,4.3rem)]" style={{ color: NAVY }}>
            Peer Review <span style={{ color: BLUE }}>Process</span>
          </h2>
          <span aria-hidden className="mx-auto mt-[clamp(0.4rem,0.6vw,0.75rem)] block h-[5px] w-[clamp(7rem,8vw,10rem)] rounded-full bg-[linear-gradient(90deg,#1a73e8,#0b3a9c)]" />
          <p className="mx-auto mt-[clamp(0.9rem,1.3vw,1.6rem)] max-w-[60rem] text-[#4b5563] text-[clamp(1rem,1.25vw,1.6rem)]">Every submission follows the same route from abstract to final decision.</p>
        </div>

        {/* Timeline */}
        <ol
          ref={ref}
          className={cn(
            'mt-12 grid gap-8 md:grid-cols-3 md:gap-x-4 md:gap-y-12 lg:mt-14',
            // Desktop: reference units. 1790 = six 285px cards + five 16px gaps in the reference.
            'xl:mt-[calc(52*var(--u))] xl:grid-cols-6 xl:gap-x-[calc(16*var(--u))] xl:[--u:calc(min(100vw_-_4rem,1790px)/1790)]',
          )}
        >
          {peerReviewSteps.map((s, i) => {
            const c = steps[i];
            const last = i === steps.length - 1;
            const rowEnd = i === 2; // end of the first row on tablet
            return (
              <li key={s.title} className="relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 md:block md:pt-[2.4rem] xl:pt-[calc(50*var(--u))]">
                {/* Number marker (above the line and every card) */}
                <span
                  className={cn(
                    'relative z-20 inline-flex size-[3.25rem] items-center justify-center rounded-full font-sans text-[1.2rem] font-extrabold tracking-tight text-white ring-4 ring-[#e4edfc] shadow-[0_8px_18px_-6px_rgba(10,61,153,0.6)]',
                    'md:absolute md:left-1/2 md:top-0 md:size-[3.8rem] md:-translate-x-1/2 md:text-[1.4rem]',
                    'xl:size-[calc(80*var(--u))] xl:text-[calc(31*var(--u))] xl:ring-[calc(4*var(--u))]',
                    inView ? 'pr-pop' : 'opacity-0',
                  )}
                  style={{ background: c.marker, ...delay(150 + i * 140) }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Connecting line to the next step + arrow connector */}
                {!last && (
                  <>
                    <span
                      aria-hidden
                      className={cn('absolute left-[1.625rem] top-[1.625rem] z-10 w-[2px] -translate-x-1/2 md:hidden', inView ? 'pr-line-y' : 'scale-y-0')}
                      style={{ height: 'calc(100% + 2rem)', background: `linear-gradient(180deg,${c.line[0]},${c.line[1]})`, ...delay(300 + i * 200) }}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-1/2 top-[1.9rem] z-10 hidden h-[2px] w-[calc(100%+1rem)]',
                        'xl:top-[calc(44*var(--u))] xl:h-[calc(2.5*var(--u))] xl:w-[calc(100%+16*var(--u))]',
                        rowEnd ? 'xl:block' : 'md:block',
                        inView ? 'pr-line-x' : 'scale-x-0',
                      )}
                      style={{ background: `linear-gradient(90deg,${c.line[0]},${c.line[1]})`, ...delay(300 + i * 200) }}
                    />
                    <Connector className={cn('left-[1.625rem] top-[calc(100%+1rem-0.8rem)] inline-flex size-[1.6rem] -translate-x-1/2 md:hidden', inView ? 'pr-pop' : 'opacity-0')}>
                      <ChevronDown className="size-4" strokeWidth={2.6} />
                    </Connector>
                    <Connector
                      className={cn(
                        'left-[calc(100%+0.5rem)] top-[calc(1.9rem-1.05rem)] hidden size-[2.1rem] -translate-x-1/2',
                        'xl:left-[calc(100%+8*var(--u))] xl:top-[calc(44*var(--u)-22*var(--u))] xl:size-[calc(44*var(--u))]',
                        rowEnd ? 'xl:inline-flex' : 'md:inline-flex',
                        inView ? 'pr-pop' : 'opacity-0',
                      )}
                    >
                      <ChevronRight className="size-[56%]" strokeWidth={3.2} />
                    </Connector>
                  </>
                )}

                {/* Card (animated on its own wrapper so the line and markers stay above every card) */}
                <div className={cn('h-full', inView ? 'pr-card-in' : 'opacity-0')} style={delay(150 + i * 140)}>
                  <div
                    className="h-full rounded-[1.3rem] pb-[5px] shadow-[0_18px_40px_-20px_rgba(30,90,200,0.38)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-20px_rgba(30,90,200,0.55)] xl:rounded-[calc(24*var(--u))] xl:pb-[calc(6*var(--u))]"
                    style={{ background: c.edge }}
                  >
                    <div className="flex h-full items-start gap-4 rounded-[1.3rem] bg-white p-5 md:flex-col md:items-center md:gap-0 md:px-4 md:pb-7 md:pt-[2.3rem] md:text-center xl:rounded-[calc(24*var(--u))] xl:px-[calc(20*var(--u))] xl:pb-[calc(24*var(--u))] xl:pt-[calc(32*var(--u))]">
                      <span className="inline-flex size-[3.75rem] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_38%,#f5f9ff,#e2ecfc)] md:size-[5.6rem] xl:size-[calc(125*var(--u))]">
                        <StepIcon index={i} />
                      </span>
                      <div className="min-w-0">
                        <h3
                          className="font-serif text-[1.2rem] font-extrabold leading-[1.12] md:mt-3 md:flex md:min-h-[2.3em] md:items-center md:justify-center md:text-[1.35rem] xl:mt-[calc(4*var(--u))] xl:text-[calc(30*var(--u))]"
                          style={{ color: NAVY }}
                        >
                          {s.title}
                        </h3>
                        <p className="mt-2 text-[0.95rem] leading-[1.5] text-[#2b3445] md:mt-3 md:text-[0.93rem] xl:mt-[calc(11*var(--u))] xl:text-[calc(19.5*var(--u))]">{s.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
