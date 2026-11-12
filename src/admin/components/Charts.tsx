import { useEffect, useId, useRef, useState } from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Single-series charts following the dataviz skill's mark specs:
 * bars <= 24px, 4px rounded data-end and square at the baseline, hairline recessive grid,
 * one hue (validated #1f5bb5 vs surface), no legend for one series, selective labels,
 * hover tooltip, and a table view so values are never chart-only.
 */
type Datum = { label: string; value: number };
const BAR = 'var(--color-globe-600)';

function niceMax(n: number) {
  if (n <= 5) return 5;
  const p = 10 ** Math.floor(Math.log10(n));
  const m = n / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

function TableToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="shrink-0 whitespace-nowrap text-sm font-semibold text-globe-700 hover:underline" aria-pressed={show}>
      {show ? 'Show chart' : 'Show table'}
    </button>
  );
}

function DataTable({ data, valueLabel }: { data: Datum[]; valueLabel: string }) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-rule text-muted">
          <th className="py-2 font-semibold">Label</th>
          <th className="py-2 text-right font-semibold">{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.label} className="border-b border-rule/70">
            <td className="py-2">{d.label}</td>
            <td className="py-2 text-right tabular-nums">{d.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Monotone cubic path through the points (no overshoot below zero or above peaks). */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  const n = pts.length;
  const dx = pts.slice(1).map((p, i) => p.x - pts[i].x);
  const slope = pts.slice(1).map((p, i) => (p.y - pts[i].y) / dx[i]);
  const m = pts.map((_, i) => {
    if (i === 0) return slope[0];
    if (i === n - 1) return slope[n - 2];
    return slope[i - 1] * slope[i] <= 0 ? 0 : (2 * slope[i - 1] * slope[i]) / (slope[i - 1] + slope[i]);
  });
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i].x + h},${pts[i].y + m[i] * h} ${pts[i + 1].x - h},${pts[i + 1].y - m[i + 1] * h} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

/**
 * Area trend for change over time: 2px line with a soft fill, 8px point markers with a
 * surface ring, crosshair + tooltip on hover (and arrow keys when focused), the latest value
 * labelled directly, a summary line above, and the same table view as the other charts.
 */
export function AreaChart({ data, valueLabel, title }: { data: Datum[]; valueLabel: string; title: string }) {
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gradId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [table]);

  const H = 220;
  const pad = { top: 22, right: 18, bottom: 28, left: 34 };
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const ticks = [0, max / 2, max];
  const innerW = Math.max(width - pad.left - pad.right, 0);
  const innerH = H - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;
  const pts = data.map((d, i) => ({ x: x(i), y: y(d.value) }));
  const line = smoothPath(pts);
  const area = line && `${line} L${pts[pts.length - 1].x},${pad.top + innerH} L${pts[0].x},${pad.top + innerH} Z`;

  const total = data.reduce((s, d) => s + d.value, 0);
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const change = last && prev ? last.value - prev.value : 0;
  const active = hover ?? null;
  const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

  return (
    <figure>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <figcaption className="text-sm text-muted">{title}</figcaption>
        <TableToggle show={table} onToggle={() => setTable((t) => !t)} />
      </div>
      {last && (
        <p className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-muted">
          <span>
            <span className="font-serif text-2xl font-semibold text-navy-900 tabular-nums">{total}</span> in total
          </span>
          <span>
            {last.label}: <strong className="font-semibold text-ink tabular-nums">{last.value}</strong>
          </span>
          {prev && (
            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', change > 0 ? 'bg-success/10 text-success' : change < 0 ? 'bg-danger/10 text-danger' : 'bg-mist text-muted')}>
              {change > 0 ? <TrendingUp aria-hidden className="size-3.5" /> : change < 0 ? <TrendingDown aria-hidden className="size-3.5" /> : <Minus aria-hidden className="size-3.5" />}
              {change > 0 ? `+${change}` : change} vs {prev.label}
            </span>
          )}
        </p>
      )}
      {table ? (
        <DataTable data={data} valueLabel={valueLabel} />
      ) : (
        <div
          ref={wrapRef}
          className="relative rounded-[var(--radius-sm)] outline-offset-4"
          role="img"
          tabIndex={0}
          aria-label={`${title}. ${data.map((d) => `${d.label}: ${d.value}`).join(', ')}. Use the left and right arrow keys to read each month.`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              setHover((h) => {
                const cur = h ?? (e.key === 'ArrowRight' ? -1 : data.length);
                return Math.min(Math.max(cur + (e.key === 'ArrowRight' ? 1 : -1), 0), data.length - 1);
              });
            } else if (e.key === 'Escape') setHover(null);
          }}
          onBlur={() => setHover(null)}
          onMouseLeave={() => setHover(null)}
        >
          {width > 0 && (
            <svg width={width} height={H} className="block overflow-visible" aria-hidden>
              <defs>
                <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={BAR} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={BAR} stopOpacity="0" />
                </linearGradient>
              </defs>
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="var(--color-rule)" strokeDasharray={t === 0 ? undefined : '3 4'} />
                  <text x={pad.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[0.72rem] tabular-nums">
                    {t}
                  </text>
                </g>
              ))}
              {data.map((d, i) => (
                <text key={d.label} x={x(i)} y={H - 8} textAnchor="middle" className={cn('text-[0.75rem]', active === i ? 'fill-navy-900 font-semibold' : 'fill-muted')}>
                  {d.label}
                </text>
              ))}
              <path d={area} fill={`url(#${gradId})`} className="chart-area-in" />
              <path d={line} fill="none" stroke={BAR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="chart-line-draw" />
              {active !== null && <line x1={pts[active].x} x2={pts[active].x} y1={pad.top} y2={pad.top + innerH} stroke="var(--color-navy-900)" strokeOpacity="0.35" />}
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={active === i ? 6 : 4} fill={BAR} stroke="#fff" strokeWidth={2} className="transition-[r] duration-150" />
              ))}
              {active === null && last && (
                <text x={pts[pts.length - 1].x} y={pts[pts.length - 1].y - 12} textAnchor="middle" className="fill-ink text-xs font-semibold tabular-nums">
                  {last.value}
                </text>
              )}
              {/* Hit areas: one column per month, wider than the marks */}
              {data.map((d, i) => (
                <rect key={d.label} x={x(i) - step / 2} y={0} width={step} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
              ))}
            </svg>
          )}
          {active !== null && width > 0 && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[var(--radius-sm)] bg-navy-900 px-2.5 py-1.5 text-xs text-white shadow-[var(--shadow-panel)]"
              style={{ left: Math.min(Math.max(pts[active].x, 60), width - 60), top: pts[active].y - 12 }}
            >
              <span className="block text-white/70">{data[active].label}</span>
              <span className="font-semibold tabular-nums">
                {data[active].value} {valueLabel.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      )}
    </figure>
  );
}

/** Horizontal bars for comparing categories with long names. */
export function BarList({ data, valueLabel, title }: { data: Datum[]; valueLabel: string; title: string }) {
  const [table, setTable] = useState(false);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure>
      <div className="mb-4 flex items-baseline justify-between">
        <figcaption className="text-sm text-muted">{title}</figcaption>
        <TableToggle show={table} onToggle={() => setTable((t) => !t)} />
      </div>
      {table ? (
        <DataTable data={data} valueLabel={valueLabel} />
      ) : (
        <ul className="space-y-3.5">
          {data.map((d) => (
            <li key={d.label} className="group" title={`${d.label}: ${d.value} ${valueLabel.toLowerCase()}`}>
              <div className="mb-1 flex justify-between gap-4 text-sm">
                <span className="text-ink">{d.label}</span>
                <span className="font-semibold tabular-nums text-ink">{d.value}</span>
              </div>
              <div className="h-3 rounded-r-[4px] bg-transparent">
                <div className="h-3 rounded-r-[4px] transition-opacity group-hover:opacity-80" style={{ width: `${(d.value / max) * 100}%`, background: BAR }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
