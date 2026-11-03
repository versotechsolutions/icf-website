import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { countries } from '@/data/countries';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { cn } from '@/utils/cn';
import type { Country } from '@/types';

type Props = {
  label: string;
  /** Selected country value. `valueKey` decides whether this is the slug or the name. */
  value: string;
  onChange: (value: string) => void;
  valueKey?: 'slug' | 'name';
  placeholder?: string;
  error?: string;
  required?: boolean;
  hideLabel?: boolean;
  id?: string;
  onBlur?: () => void;
  /** Optional list to search (defaults to all countries). */
  options?: Country[];
  allowClear?: boolean;
};

/** Searchable country dropdown (WAI-ARIA combobox with listbox popup). */
export function CountryCombobox({
  label,
  value,
  onChange,
  valueKey = 'slug',
  placeholder = 'Search countries',
  error,
  required,
  hideLabel,
  id: idProp,
  onBlur,
  options = countries,
  allowClear = true,
}: Props) {
  const autoId = useId();
  const id = idProp ?? `cc-${autoId}`;
  const listId = `${id}-list`;
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const selected = options.find((c) => c[valueKey] === value);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q) : options;
  }, [query, options]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);
  useOnClickOutside(wrap, close, open);

  const choose = (c: Country) => {
    onChange(c[valueKey]);
    close();
    input.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      if (results[active]) choose(results[active]);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <div ref={wrap} className="relative flex flex-col gap-1.5">
      <label htmlFor={id} className={cn('text-[0.92rem] font-semibold text-navy-900', hideLabel && 'sr-only')}>
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          ref={input}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${id}-opt-${results[active].code}` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off"
          className="field-input pl-9 pr-16"
          placeholder={selected ? selected.name : placeholder}
          value={open ? query : (selected?.name ?? '')}
          onFocus={() => {
            setOpen(true);
            setActive(0);
          }}
          onBlur={onBlur}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {allowClear && selected && (
            <button
              type="button"
              aria-label={`Clear ${label.toLowerCase()}`}
              className="rounded p-1 text-muted hover:bg-mist hover:text-navy-900"
              onClick={() => {
                onChange('');
                close();
              }}
            >
              <X className="size-4" />
            </button>
          )}
          <ChevronDown aria-hidden className="size-4 text-muted" />
        </div>
      </div>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-rule bg-white py-1 shadow-[var(--shadow-panel)]"
        >
          {results.length === 0 && <li className="px-3 py-2.5 text-sm text-muted">No country matches "{query}".</li>}
          {results.map((c, i) => (
            <li
              key={c.code}
              id={`${id}-opt-${c.code}`}
              role="option"
              aria-selected={c[valueKey] === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(c)}
              onMouseEnter={() => setActive(i)}
              className={cn('flex cursor-pointer items-center justify-between px-3 py-2 text-[0.95rem]', i === active && 'bg-globe-100 text-navy-900')}
            >
              <span>{c.name}</span>
              {c[valueKey] === value && <Check aria-hidden className="size-4 text-globe-700" />}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
