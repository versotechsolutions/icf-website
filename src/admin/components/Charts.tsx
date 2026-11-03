import { useState } from 'react';
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
    <button onClick={onToggle} className="text-sm font-semibold text-globe-700 hover:underline" aria-pressed={show}>
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

/** Vertical columns for change over time. */
export function ColumnChart({ data, valueLabel, title }: { data: Datum[]; valueLabel: string; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const ticks = [0, max / 2, max];
  const H = 200;
  const peak = data.reduce((iMax, d, i, arr) => (d.value > arr[iMax].value ? i : iMax), 0);

  return (
    <figure>
      <div className="mb-3 flex items-baseline justify-between">
        <figcaption className="text-sm text-muted">{title}</figcaption>
        <TableToggle show={table} onToggle={() => setTable((t) => !t)} />
      </div>
      {table ? (
        <DataTable data={data} valueLabel={valueLabel} />
      ) : (
        <div className="relative pl-8" role="img" aria-label={`${title}. ${data.map((d) => `${d.label}: ${d.value}`).join(', ')}`}>
          {/* grid */}
          <div className="absolute inset-y-0 left-8 right-0" style={{ height: H }} aria-hidden>
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-rule" style={{ bottom: (t / max) * H }}>
                <span className="absolute -left-8 -top-2.5 w-6 text-right text-[0.72rem] text-muted tabular-nums">{t}</span>
              </div>
            ))}
          </div>
          <div className="relative flex items-end justify-around" style={{ height: H }}>
            {data.map((d, i) => (
              <div
                key={d.label}
                className="relative flex h-full flex-1 items-end justify-center"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {(i === peak || hover === i) && (
                  <span
                    className={cn('absolute text-xs font-semibold tabular-nums', hover === i ? 'rounded bg-navy-900 px-2 py-1 text-white shadow' : 'text-ink')}
                    style={{ bottom: (d.value / max) * H + 6 }}
                  >
                    {hover === i ? `${d.label}: ${d.value} ${valueLabel.toLowerCase()}` : d.value}
                  </span>
                )}
                <div className={cn('w-full max-w-6 rounded-t-[4px] transition-opacity', hover !== null && hover !== i && 'opacity-50')} style={{ height: (d.value / max) * H, background: BAR }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-around border-t border-ink/30 pt-2">
            {data.map((d) => (
              <span key={d.label} className="flex-1 text-center text-[0.75rem] text-muted">
                {d.label}
              </span>
            ))}
          </div>
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
