import { useState, type ChangeEvent, type FormEvent } from 'react';
import { validate, type Schema } from '@/utils/validation';

/**
 * Small controlled-form hook with schema validation.
 * Errors appear after a field is blurred or the form is submitted, then update live.
 */
export function useForm<T extends string>(initial: Record<T, string>, schema: Schema<T>) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState<Partial<Record<T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors = validate(values, schema);
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([k]) => submitted || touched[k as T]),
  ) as Partial<Record<T, string>>;

  const set = (name: T, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const field = (name: T) => ({
    name,
    id: `f-${name}`,
    value: values[name],
    error: visibleErrors[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const t = e.target as HTMLInputElement;
      set(name, t.type === 'checkbox' ? String(t.checked) : t.value);
    },
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  });

  const handleSubmit = (onValid: (v: Record<T, string>) => void) => (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const keys = Object.keys(errors) as T[];
    if (keys.length) {
      document.getElementById(`f-${keys[0]}`)?.focus();
      return;
    }
    onValid(values);
  };

  const reset = () => {
    setValues(initial);
    setTouched({});
    setSubmitted(false);
  };

  return { values, set, field, errors: visibleErrors, errorCount: Object.keys(errors).length, submitted, handleSubmit, reset };
}
