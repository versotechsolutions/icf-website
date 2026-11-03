import { useState } from 'react';
import { CheckCircle2, CreditCard, Info } from 'lucide-react';
import { registrationCategoriesIntro, registrationFees, registrationInfo, registrationIntro, registrationRules, registrationSteps } from '@/data/content';
import { site } from '@/data/site';
import { conferenceSnapshot } from '@/services/conferences';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useForm } from '@/hooks/useForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { CheckboxField, SelectField, TextField } from '@/components/forms/Fields';
import { CountryCombobox } from '@/components/forms/CountryCombobox';
import { ContactBlock } from '@/components/layout/ContactBlock';
import { checked, email, phone, required, selectRequired, type Rule } from '@/utils/validation';
import { formatUsd } from '@/utils/format';
import { cn } from '@/utils/cn';

const presentingCategories = ['Author Presentation', 'Virtual Keynote Speaker Registration', 'Pre-recorded Video Submission', 'Online Presentation'];

function FeeTable({ selected, period, onPick }: { selected: string; period: string; onPick: (c: string, p: 'pre' | 'standard') => void }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-rule">
      <table className="w-full min-w-[34rem] text-left">
        <caption className="sr-only">Registration categories and fees in US dollars</caption>
        <thead className="bg-navy-900 text-white">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">Category</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Pre-enrolment</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Standard participation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {registrationFees.map((f) => {
            const rowSel = f.category === selected;
            const cell = (p: 'pre' | 'standard', amount: number) => (
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => onPick(f.category, p)}
                  aria-pressed={rowSel && period === p}
                  aria-label={`Select ${f.category}, ${p === 'pre' ? 'pre-enrolment' : 'standard'} fee ${formatUsd(amount)}`}
                  className={cn(
                    'rounded-[var(--radius-sm)] px-2.5 py-1.5 font-semibold tabular-nums',
                    rowSel && period === p ? 'bg-gold-500 text-navy-950' : 'text-navy-900 hover:bg-gold-50',
                  )}
                >
                  {formatUsd(amount)}
                </button>
              </td>
            );
            return (
              <tr key={f.category} className={cn(rowSel && 'bg-gold-50/60')}>
                <th scope="row" className="px-5 py-3 font-semibold text-navy-900">
                  {f.category}
                </th>
                {cell('pre', f.preEnrolment)}
                {cell('standard', f.standard)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function RegistrationPage() {
  usePageMeta('Registration', 'Register for an International Conference Forum (ICF) conference: categories, fees in USD and registration steps.');
  const conferences = conferenceSnapshot.upcoming();
  const [done, setDone] = useState(false);

  const paperRequired: Rule = (v, all) => (presentingCategories.includes(all.category) && !v.trim() ? 'Enter the title of the paper you will present.' : null);

  const form = useForm(
    { fullName: '', email: '', phoneCode: '+91', phone: '', country: '', institution: '', conference: '', category: '', period: 'pre', paperTitle: '', coAuthors: '0', consent: 'false' },
    {
      fullName: [required('your full name')],
      email: [required('your email address'), email],
      phoneCode: [],
      phone: [required('your phone number'), phone],
      country: [selectRequired('your country')],
      institution: [required('your organisation or institution')],
      conference: [selectRequired('a conference')],
      category: [selectRequired('a registration category')],
      period: [],
      paperTitle: [paperRequired],
      coAuthors: [],
      consent: [checked('Confirm that you have read the registration notes to continue.')],
    },
  );

  const fee = registrationFees.find((f) => f.category === form.values.category);
  const amount = fee ? (form.values.period === 'pre' ? fee.preEnrolment : fee.standard) : null;
  const pick = (c: string, p: 'pre' | 'standard') => {
    form.set('category', c);
    form.set('period', p);
    document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const selectedConf = conferences.find((c) => c.slug === form.values.conference);

  return (
    <>
      <PageHeader title="Register for ICF conference" crumbs={[{ label: 'For participants' }, { label: 'Registration' }]} intro={registrationIntro} />
      <EventInfoLayout>
        <section aria-labelledby="info-h">
          <h2 id="info-h" className="text-h2">
            Registration information
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <p className="mt-6 max-w-[66ch] leading-relaxed text-ink/90">{registrationInfo}</p>
          <p className="mt-4 max-w-[66ch] leading-relaxed text-ink/90">
            For assistance with registration fees, payment procedures, or bank transfer details, please contact the ICF Conference Coordinator at{' '}
            <a className="link-underline" href={site.contact.phoneHref}>
              {site.contact.phone}
            </a>{' '}
            or email{' '}
            <a className="link-underline" href={`mailto:${site.contact.supportEmail}`}>
              {site.contact.supportEmail}
            </a>
            . Our Conference Coordination Team will be happy to assist you with your registration and payment-related queries.
          </p>
        </section>

        <section aria-labelledby="fees-h" className="mt-16">
          <h2 id="fees-h" className="text-h2">
            Registration categories and fees
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <p className="mt-6 max-w-[66ch] leading-relaxed text-ink/90">{registrationCategoriesIntro}</p>
          <FeeTable selected={form.values.category} period={form.values.period} onPick={pick} />
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Info aria-hidden className="size-4" /> Select a fee to pre-fill the registration form.
          </p>
        </section>

        <section id="register-form" aria-labelledby="form-h" className="mt-16 scroll-mt-28">
          <h2 id="form-h" className="text-h2">
            Registration form
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <Notice tone="sample" className="mt-6">
            Frontend demonstration. Details entered here are validated in the browser only; nothing is submitted, stored or charged.
          </Notice>

          {done ? (
            <div role="status" className="mt-8 rounded-[var(--radius-lg)] border border-success/30 bg-success/5 p-8">
              <CheckCircle2 aria-hidden className="size-9 text-success" />
              <h3 className="mt-4 text-h3">Registration details checked</h3>
              <p className="mt-2 max-w-[60ch] text-ink/85">
                In the live site, {form.values.fullName} would now continue to payment for {form.values.category} ({amount !== null && formatUsd(amount)}) and receive a confirmation at {form.values.email}.
              </p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={() => {
                  form.reset();
                  setDone(false);
                }}
              >
                Start a new registration
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={form.handleSubmit(() => setDone(true))} className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_17rem]">
              <div className="space-y-10">
                {form.submitted && form.errorCount > 0 && (
                  <div role="alert" className="rounded-[var(--radius-md)] border border-danger/40 bg-danger/5 px-4 py-3 text-[0.95rem] text-danger">
                    {form.errorCount === 1 ? 'One field needs attention.' : `${form.errorCount} fields need attention.`} Check the highlighted fields below.
                  </div>
                )}
                <fieldset className="grid gap-5 sm:grid-cols-2">
                  <legend className="mb-4 font-serif text-xl font-semibold text-navy-900">Personal details</legend>
                  <TextField label="Full name" required autoComplete="name" className="sm:col-span-2" {...form.field('fullName')} />
                  <TextField label="Email address" required type="email" autoComplete="email" {...form.field('email')} />
                  <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                    <TextField label="Code" required autoComplete="tel-country-code" {...form.field('phoneCode')} />
                    <TextField label="Phone number" required type="tel" autoComplete="tel-national" {...form.field('phone')} />
                  </div>
                  <CountryCombobox
                    id="f-country"
                    label="Country"
                    required
                    valueKey="name"
                    value={form.values.country}
                    onChange={(v) => form.set('country', v)}
                    onBlur={form.field('country').onBlur}
                    error={form.errors.country}
                    placeholder="Search countries"
                  />
                  <TextField label="Organisation / institution" required autoComplete="organization" {...form.field('institution')} />
                </fieldset>

                <fieldset className="grid gap-5 sm:grid-cols-2">
                  <legend className="mb-4 font-serif text-xl font-semibold text-navy-900">Conference details</legend>
                  <SelectField
                    label="Conference"
                    required
                    className="sm:col-span-2"
                    placeholder="Choose a conference"
                    options={conferences.map((c) => ({ value: c.slug, label: `${c.acronym}: ${c.title} (sample)` }))}
                    {...form.field('conference')}
                  />
                  <SelectField label="Registration category" required placeholder="Choose a category" options={registrationFees.map((f) => f.category)} {...form.field('category')} />
                  <SelectField
                    label="Fee period"
                    required
                    options={[
                      { value: 'pre', label: 'Pre-enrolment' },
                      { value: 'standard', label: 'Standard participation' },
                    ]}
                    {...form.field('period')}
                  />
                  {presentingCategories.includes(form.values.category) && (
                    <>
                      <TextField label="Paper title" required className="sm:col-span-2" {...form.field('paperTitle')} />
                      <SelectField
                        label="Number of co-authors"
                        hint="A maximum of five authors/co-authors are allowed per paper."
                        options={['0', '1', '2', '3', '4']}
                        {...form.field('coAuthors')}
                      />
                    </>
                  )}
                </fieldset>

                <CheckboxField
                  id="f-consent"
                  name="consent"
                  checked={form.values.consent === 'true'}
                  onChange={form.field('consent').onChange}
                  onBlur={form.field('consent').onBlur}
                  error={form.errors.consent}
                  label="I have read the important notes below, including the registration deadlines and payment proof requirements."
                />
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" size="lg">
                    Continue to payment
                  </Button>
                </div>
              </div>

              {/* Live summary */}
              <aside aria-label="Registration summary" className="self-start rounded-[var(--radius-lg)] border border-rule bg-mist p-5 xl:sticky xl:top-28">
                <h3 className="font-serif text-lg font-semibold">Summary</h3>
                <dl className="mt-4 space-y-3 text-[0.95rem]">
                  <div>
                    <dt className="text-sm text-muted">Conference</dt>
                    <dd className="font-semibold text-navy-900">{selectedConf ? selectedConf.acronym : 'Not chosen'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">Category</dt>
                    <dd className="font-semibold text-navy-900">{form.values.category || 'Not chosen'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">Fee period</dt>
                    <dd className="font-semibold text-navy-900">{form.values.period === 'pre' ? 'Pre-enrolment' : 'Standard participation'}</dd>
                  </div>
                </dl>
                <div className="mt-5 border-t border-rule pt-4">
                  <p className="text-sm text-muted">Registration fee</p>
                  <p className="font-serif text-3xl font-semibold text-navy-900 tabular-nums">{amount !== null ? formatUsd(amount) : '—'}</p>
                </div>
                <Button type="button" variant="gold" className="mt-5 w-full" disabled aria-describedby="pay-note">
                  <CreditCard aria-hidden className="size-4" />
                  Make payment
                </Button>
                <p id="pay-note" className="mt-2 text-xs text-muted">
                  Online payment is connected in a later phase.
                </p>
              </aside>
            </form>
          )}
        </section>

        <section aria-labelledby="notes-h" className="mt-16">
          <h2 id="notes-h" className="text-h2">
            Important notes
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <ol className="mt-8 space-y-6">
            {registrationSteps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-navy-900 font-serif text-lg font-semibold text-gold-300">{i + 1}</span>
                <div>
                  <h3 className="font-serif text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink/85">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="mt-8 space-y-2 rounded-[var(--radius-md)] border-l-4 border-gold-500 bg-gold-50 px-5 py-4">
            {registrationRules.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-700" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <ContactBlock className="mt-16" intro="For more information about our committees or if you have any inquiries, feel free to reach out." />
      </EventInfoLayout>
    </>
  );
}
