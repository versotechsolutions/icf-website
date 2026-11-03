/** Minimal client-side validation helpers. Server-side validation is still required in Phase 2. */
export type Rule = (value: string, all: Record<string, string>) => string | null;
export type Schema<T extends string> = Record<T, Rule[]>;

export const required = (label: string): Rule => (v) => (v.trim() ? null : `Enter ${label.toLowerCase()}.`);
export const selectRequired = (label: string): Rule => (v) => (v ? null : `Choose ${label.toLowerCase()}.`);
export const email: Rule = (v) =>
  !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Enter an email address in the format name@example.com.';
export const phone: Rule = (v) =>
  !v.trim() || /^[+()\d\s-]{7,20}$/.test(v.trim()) ? null : 'Enter a phone number using digits, spaces, + or -.';
export const minLength = (n: number, label: string): Rule => (v) =>
  !v.trim() || v.trim().length >= n ? null : `${label} must be at least ${n} characters.`;
export const maxLength = (n: number, label: string): Rule => (v) =>
  v.length <= n ? null : `${label} must be ${n} characters or fewer.`;
export const checked = (message: string): Rule => (v) => (v === 'true' ? null : message);

export function validate<T extends string>(values: Record<T, string>, schema: Schema<T>) {
  const errors: Partial<Record<T, string>> = {};
  (Object.keys(schema) as T[]).forEach((key) => {
    for (const rule of schema[key]) {
      const msg = rule(values[key] ?? "", values as Record<string, string>);
      if (msg) {
        errors[key] = msg;
        break;
      }
    }
  });
  return errors;
}
