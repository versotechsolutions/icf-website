import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import { registrationFees } from '@/data/content';
import { countries, countryByCode } from '@/data/countries';
import { topics } from '@/data/topics';
import { useForm } from '@/hooks/useForm';
import { required, selectRequired, type Rule } from '@/utils/validation';
import { CheckboxField, SelectField, TextAreaField, TextField } from '@/components/forms/Fields';
import { CountryCombobox } from '@/components/forms/CountryCombobox';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader, Panel } from '../components/AdminUI';
import { useToast } from '../components/Toast';
import { slugify, useAdminData, type AdminConference } from '../AdminData';
import type { ConferenceMode, ConferenceStatus } from '@/types';

const endAfterStart: Rule = (v, all) => (v && all.startDate && v < all.startDate ? 'End date must be on or after the start date.' : null);
const deadlineBeforeStart: Rule = (v, all) => (v && all.startDate && v > all.startDate ? 'Deadline must be before the conference starts.' : null);

/** Add / edit conference. Fields follow the "Single Events Upload" list in ICF Admin Dashboard.docx, within the agreed scope. */
export default function ConferenceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { conferences, addConferences, updateConference } = useAdminData();
  const existing = conferences.find((c) => c.id === id);
  const d = existing?.details ?? {};
  const [image, setImage] = useState<string | null>(null);

  const uniqueAcronym: Rule = (v) =>
    v.trim() && conferences.some((c) => c.id !== existing?.id && c.acronym.toLowerCase() === v.trim().toLowerCase()) ? 'Another conference already uses this short form.' : null;

  const form = useForm(
    {
      title: existing?.title ?? '',
      acronym: existing?.acronym ?? '',
      topic: existing?.topicSlug ?? '',
      eventType: d.eventType ?? 'Conference',
      mode: existing?.mode ?? 'In person',
      startDate: existing?.startDate ?? '',
      endDate: existing?.endDate ?? '',
      time: d.time || '09:00',
      timezone: d.timezone || 'Asia/Kolkata',
      venueName: d.venueName ?? '',
      venueAddress: d.venueAddress ?? '',
      city: existing?.city ?? '',
      state: d.state ?? '',
      country: existing ? (countryByCode(existing.countryCode)?.name ?? '') : '',
      description: d.description ?? '',
      earlyDeadline: d.earlyDeadline ?? '',
      finalDeadline: d.finalDeadline ?? '',
      submissionDeadline: d.submissionDeadline ?? '',
      tags: d.tags ?? '',
      status: existing?.status ?? 'Draft',
      featured: String(existing?.featured ?? false),
    },
    {
      title: [required('the conference title')],
      acronym: [required('the short form, for example ICICGB-26'), uniqueAcronym],
      topic: [selectRequired('a subject area')],
      eventType: [],
      mode: [],
      startDate: [required('the start date')],
      endDate: [required('the end date'), endAfterStart],
      time: [],
      timezone: [],
      venueName: [],
      venueAddress: [],
      city: [required('the city')],
      state: [],
      country: [selectRequired('the country')],
      description: [required('a description')],
      earlyDeadline: [deadlineBeforeStart],
      finalDeadline: [deadlineBeforeStart],
      submissionDeadline: [deadlineBeforeStart],
      tags: [],
      status: [],
      featured: [],
    },
  );

  const save = (v: typeof form.values) => {
    const record: AdminConference = {
      id: existing?.id ?? `new-${Date.now().toString(36)}`,
      slug: existing?.slug ?? slugify(v.acronym),
      title: v.title.trim(),
      acronym: v.acronym.trim().toUpperCase(),
      topicSlug: v.topic,
      countryCode: countries.find((c) => c.name === v.country)?.code ?? existing?.countryCode ?? '',
      city: v.city.trim(),
      startDate: v.startDate,
      endDate: v.endDate,
      mode: v.mode as ConferenceMode,
      status: v.status as ConferenceStatus,
      featured: v.featured === 'true',
      isSample: true,
      addedInSession: existing ? existing.addedInSession : true,
      details: { ...v },
    };
    if (existing) updateConference(existing.id, record);
    else addConferences([record]);
    toast(`${record.acronym} ${existing ? 'updated' : 'created'} in this demo session (not saved permanently).`);
    navigate('/admin/conferences');
  };

  if (id && !existing) {
    return (
      <>
        <AdminPageHeader title="Conference not found" intro="This conference is not in the current list. It may have been deleted in this demo session." />
        <Link to="/admin/conferences" className="inline-flex items-center gap-1.5 font-semibold text-globe-700 hover:underline">
          <ArrowLeft aria-hidden className="size-4" /> Back to conferences
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/admin/conferences" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-globe-700 hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> Conferences
      </Link>
      <AdminPageHeader title={existing ? `Edit ${existing.acronym}` : 'Add conference'} intro="Fields marked * are required. Dates and fees appear on the public conference page." />
      <form noValidate onSubmit={form.handleSubmit(save)} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Panel title="Conference details">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Conference title" required className="sm:col-span-2" {...form.field('title')} />
              <TextField label="Short form and year" required placeholder="ICICGB-26" {...form.field('acronym')} />
              <SelectField label="Subject area" required placeholder="Choose a subject area" options={topics.map((t) => ({ value: t.slug, label: t.name }))} {...form.field('topic')} />
              <SelectField label="Event type" options={['Conference', 'Seminar', 'Workshop', 'Symposium']} {...form.field('eventType')} />
              <SelectField label="Format" options={['In person', 'Hybrid', 'Online']} {...form.field('mode')} />
              <TextAreaField label="Description" required className="sm:col-span-2" rows={5} hint="Shown as 'About the conference' on the public page." {...form.field('description')} />
            </div>
          </Panel>
          <Panel title="Date and venue">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Start date" required type="date" {...form.field('startDate')} />
              <TextField label="End date" required type="date" {...form.field('endDate')} />
              <TextField label="Start time" type="time" {...form.field('time')} />
              <SelectField label="Time zone" options={['Asia/Kolkata', 'Asia/Tokyo', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'Europe/Paris', 'America/New_York', 'Australia/Melbourne', 'UTC']} {...form.field('timezone')} />
              <TextField label="Venue name" {...form.field('venueName')} />
              <TextField label="Venue address" {...form.field('venueAddress')} />
              <TextField label="City" required {...form.field('city')} />
              <TextField label="State / region" {...form.field('state')} />
              <CountryCombobox id="f-country" label="Country" required valueKey="name" value={form.values.country} onChange={(v) => form.set('country', v)} onBlur={form.field('country').onBlur} error={form.errors.country} />
            </div>
          </Panel>
          <Panel title="Fees and deadlines">
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField label="Early registration deadline" type="date" {...form.field('earlyDeadline')} />
              <TextField label="Final registration deadline" type="date" {...form.field('finalDeadline')} />
              <TextField label="Paper submission deadline" type="date" {...form.field('submissionDeadline')} />
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-sm">
                <caption className="mb-2 text-left text-sm font-semibold text-navy-900">Registration fees (USD)</caption>
                <thead>
                  <tr className="text-muted">
                    <th className="py-2 font-semibold">Category</th>
                    <th className="py-2 font-semibold">Pre-enrolment</th>
                    <th className="py-2 font-semibold">Standard</th>
                  </tr>
                </thead>
                <tbody>
                  {registrationFees.map((f) => (
                    <tr key={f.category} className="border-t border-rule">
                      <td className="py-2 pr-3">{f.category}</td>
                      <td className="py-1.5 pr-3">
                        <input aria-label={`${f.category} pre-enrolment fee`} className="field-input max-w-28 py-1.5" type="number" min={0} step="0.01" defaultValue={f.preEnrolment} />
                      </td>
                      <td className="py-1.5">
                        <input aria-label={`${f.category} standard fee`} className="field-input max-w-28 py-1.5" type="number" min={0} step="0.01" defaultValue={f.standard} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Publishing">
            <div className="space-y-5">
              <SelectField label="Status" options={['Draft', 'Pending', 'Published', 'Completed']} {...form.field('status')} />
              <CheckboxField id="f-featured" name="featured" label="Feature on the homepage" checked={form.values.featured === 'true'} onChange={form.field('featured').onChange} />
              <TextField label="Tags" hint="Separate with commas" {...form.field('tags')} />
              <div className="flex flex-col gap-2 border-t border-rule pt-5">
                <Button type="submit">{existing ? 'Save changes' : 'Create conference'}</Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/admin/conferences')}>
                  Cancel
                </Button>
              </div>
            </div>
          </Panel>
          <Panel title="Conference image">
            <label htmlFor="f-image" className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-navy-100 bg-mist p-6 text-center text-sm text-muted hover:border-navy-800">
              {image ? <img src={image} alt="Selected conference image preview" className="max-h-40 rounded" /> : <ImagePlus aria-hidden className="size-8 text-globe-600" strokeWidth={1.4} />}
              <span className="font-semibold text-navy-900">{image ? 'Replace image' : 'Upload image'}</span>
              <span>JPG or PNG, up to 2 MB</span>
            </label>
            <input
              id="f-image"
              type="file"
              accept="image/jpeg,image/png"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setImage(URL.createObjectURL(f));
              }}
            />
          </Panel>
        </div>
      </form>
    </>
  );
}
