import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

type Base = { label: string; id: string; error?: string; hint?: ReactNode; required?: boolean; className?: string };

export function FieldShell({ label, id, error, hint, required, className, children }: Base & { children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[0.92rem] font-semibold text-navy-900">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden>
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-0.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-medium text-danger">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

export function TextField({ label, id, error, hint, required, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell {...{ label, id, error, hint, required, className }}>
      <input id={id} className="field-input" aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </FieldShell>
  );
}

export function SelectField({
  label,
  id,
  error,
  hint,
  required,
  className,
  placeholder,
  options,
  ...rest
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string; options: (string | { value: string; label: string })[] }) {
  return (
    <FieldShell {...{ label, id, error, hint, required, className }}>
      <select id={id} className="field-input" aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({ label, id, error, hint, required, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell {...{ label, id, error, hint, required, className }}>
      <textarea id={id} rows={6} className="field-input resize-y" aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </FieldShell>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  checked,
  onChange,
  onBlur,
  name,
}: {
  id: string;
  name: string;
  label: ReactNode;
  error?: string;
  checked: boolean;
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
  onBlur?: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 text-[0.95rem] leading-snug">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-navy-900"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 pl-8 text-sm font-medium text-danger">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
