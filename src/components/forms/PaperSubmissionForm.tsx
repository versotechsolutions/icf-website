import { useState } from 'react';
import { CheckCircle2, FileUp, Send } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { FieldShell, SelectField, TextField } from '@/components/forms/Fields';
import { CountryCombobox } from '@/components/forms/CountryCombobox';
import { email, phone, required, selectRequired, type Rule } from '@/utils/validation';
import { cn } from '@/utils/cn';

/** Presentation modes, matching the presenting registration categories (in person, online, pre-recorded). */
const presentationModes = ['In-person presentation', 'Online presentation', 'Pre-recorded video presentation'];

const wordFile: Rule = (v) => (!v ? 'Attach your paper as a .doc or .docx file.' : /\.docx?$/i.test(v) ? null : 'The file must be a Word document (.doc or .docx).');

/**
 * Paper submission form, from the client's "Paper Submission page" reference with the
 * Journal Publication field removed. Frontend only: validates in the browser, sends nothing.
 */
export function PaperSubmissionForm() {
  const [sent, setSent] = useState(false);
  const form = useForm(
    {
      fullName: '',
      email: '',
      phoneCode: '',
      phone: '',
      paperTitle: '',
      institution: '',
      conferenceName: '',
      conferenceDate: '',
      conferenceCity: '',
      conferenceCountry: '',
      presentationMode: '',
      paperFile: '',
    },
    {
      fullName: [required('your full name')],
      email: [required("the author's email"), email],
      phoneCode: [],
      phone: [phone],
      paperTitle: [required('the paper title')],
      institution: [required('your college or university')],
      conferenceName: [required('the conference name')],
      conferenceDate: [required('the conference date')],
      conferenceCity: [required('the conference city')],
      conferenceCountry: [selectRequired('the conference country')],
      presentationMode: [selectRequired('a mode of presentation')],
      paperFile: [wordFile],
    },
  );

  if (sent) {
    return (
      <div role="status" className="mt-8 rounded-[var(--radius-lg)] border border-success/30 bg-success/5 p-8">
        <CheckCircle2 aria-hidden className="size-9 text-success" />
        <h3 className="mt-4 text-h3">Paper ready to submit</h3>
        <p className="mt-2 text-ink/85">
          Thank you, {form.values.fullName}. In the live site "{form.values.paperTitle}" will be sent to the ICF team, and an acknowledgment emailed to {form.values.email} within three working days.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            form.reset();
            setSent(false);
          }}
        >
          Submit another paper
        </Button>
      </div>
    );
  }

  const fileField = form.field('paperFile');
  // form.field() minus `error`, for plain <input> elements
  const nativeProps = (name: 'phoneCode' | 'phone') => {
    const { error: _error, ...props } = form.field(name);
    return props;
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(() => setSent(true))} className="mt-8 grid gap-5 sm:grid-cols-2">
      {form.submitted && form.errorCount > 0 && (
        <div role="alert" className="rounded-[var(--radius-md)] border border-danger/40 bg-danger/5 px-4 py-3 text-[0.95rem] text-danger sm:col-span-2">
          {form.errorCount === 1 ? 'One field needs attention.' : `${form.errorCount} fields need attention.`} Check the highlighted fields below.
        </div>
      )}
      <TextField label="Full name" required autoComplete="name" {...form.field('fullName')} />
      <TextField label="Author's email" required type="email" autoComplete="email" {...form.field('email')} />
      <FieldShell label="Phone number" id="f-phone" error={form.errors.phone}>
        <div className="grid grid-cols-[6.5rem_1fr] gap-2">
          <input
            className="field-input"
            aria-label="Country code"
            autoComplete="tel-country-code"
            placeholder="eg: +1"
            {...nativeProps('phoneCode')}
          />
          <input
            className="field-input"
            type="tel"
            autoComplete="tel-national"
            aria-invalid={!!form.errors.phone}
            aria-describedby={form.errors.phone ? 'f-phone-error' : undefined}
            {...nativeProps('phone')}
          />
        </div>
      </FieldShell>
      <TextField label="Paper title" required {...form.field('paperTitle')} />
      <TextField label="College / University" required autoComplete="organization" {...form.field('institution')} />
      <TextField label="Conference name" required {...form.field('conferenceName')} />
      <TextField label="Conference date" required type="date" {...form.field('conferenceDate')} />
      <TextField label="Conference city" required {...form.field('conferenceCity')} />
      <CountryCombobox
        id="f-conferenceCountry"
        label="Conference country"
        required
        valueKey="name"
        value={form.values.conferenceCountry}
        onChange={(v) => form.set('conferenceCountry', v)}
        onBlur={form.field('conferenceCountry').onBlur}
        error={form.errors.conferenceCountry}
      />
      <SelectField label="Presentation mode" required placeholder="Select mode of presentation" options={presentationModes} {...form.field('presentationMode')} />

      <FieldShell label="Attach your file" id="f-paperFile" required error={fileField.error} hint="Word documents only (.doc or .docx)" className="sm:col-span-2">
        <label
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border border-dashed bg-white px-4 py-3 transition-colors hover:border-navy-900 focus-within:border-globe-600 focus-within:ring-3 focus-within:ring-globe-600/20',
            fileField.error ? 'border-danger' : 'border-[#b9c4d4]',
          )}
        >
          <FileUp aria-hidden className="size-5 shrink-0 text-gold-700" />
          <span className="font-semibold text-navy-900">Choose file</span>
          <span className="min-w-0 truncate text-muted">{form.values.paperFile || 'No file chosen'}</span>
          <input
            id="f-paperFile"
            name="paperFile"
            type="file"
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            aria-invalid={!!fileField.error}
            aria-required
            aria-describedby={['f-paperFile-hint', fileField.error ? 'f-paperFile-error' : ''].filter(Boolean).join(' ')}
            onChange={(e) => {
              form.set('paperFile', e.target.files?.[0]?.name ?? '');
              fileField.onBlur();
            }}
          />
        </label>
      </FieldShell>

      <Notice tone="sample" className="sm:col-span-2">
        Frontend demonstration: the form validates in the browser but does not upload or store papers yet.
      </Notice>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg">
          <Send aria-hidden className="size-4" />
          Submit paper
        </Button>
      </div>
    </form>
  );
}
