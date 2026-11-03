import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode };

/** Accessible disclosure list (button + region), multiple panels may be open. */
export function Accordion({ items, defaultOpen = [], numbered = false }: { items: AccordionItem[]; defaultOpen?: string[]; numbered?: boolean }) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));
  const uid = useId();
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {items.map((item, i) => {
        const isOpen = open.has(item.id);
        const btn = `${uid}-b-${i}`;
        const panel = `${uid}-p-${i}`;
        return (
          <div key={item.id}>
            <h3 className="font-sans text-base">
              <button
                id={btn}
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-start gap-4 py-5 text-left font-semibold text-navy-900 hover:text-globe-700"
              >
                {numbered && <span className="w-7 shrink-0 pt-px font-serif text-lg font-semibold text-gold-700 tabular-nums">{i + 1}</span>}
                <span className="flex-1 text-[1.05rem] leading-snug">{item.title}</span>
                <Plus aria-hidden className={cn('mt-0.5 size-5 shrink-0 text-gold-500 transition-transform duration-200', isOpen && 'rotate-45')} />
              </button>
            </h3>
            <div id={panel} role="region" aria-labelledby={btn} hidden={!isOpen} className={cn('pb-6 leading-relaxed text-ink/85', numbered && 'pl-11', 'pr-9')}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
