import { useState } from 'react';
import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { sampleConferences } from '@/data/conferences.sample';
import { agendaHighlights, conferenceHighlights, exampleVenue, icicgbAbout } from '@/data/content';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader, Panel, SegmentedFilter } from '../components/AdminUI';
import { useToast } from '../components/Toast';

/**
 * Conference-specific content management: the sections of each event page
 * (About, Highlights, Programme, Venue, Gallery uploads) plus basic SEO fields.
 * Field list follows "Content Update Dashboard" and "SEO Dashboard" in ICF Admin Dashboard.docx.
 */
const sections = ['About', 'Highlights', 'Programme', 'Venue', 'Gallery', 'SEO'] as const;

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.92rem] font-semibold text-navy-900">{label}</label>
      {children}
    </div>
  );
}

export default function ContentPage() {
  const toast = useToast();
  const [slug, setSlug] = useState('icicgb-26');
  const [section, setSection] = useState<(typeof sections)[number]>('About');
  const conf = sampleConferences.find((c) => c.slug === slug)!;
  const [highlights, setHighlights] = useState(conferenceHighlights.map((h) => `${h.title}: ${h.text}`));
  const [status, setStatus] = useState('Published');

  return (
    <>
      <AdminPageHeader
        title="Conference content"
        intro="Edit the content shown on each conference's public page."
        actions={
          <select aria-label="Conference" className="field-input py-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {sampleConferences.map((c) => <option key={c.slug} value={c.slug}>{c.acronym}</option>)}
          </select>
        }
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SegmentedFilter label="Page section" options={sections} value={section} onChange={setSection} />
        <a href={`/event/${slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-globe-700 hover:underline">View public page</a>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <Panel title={`${section}: ${conf.acronym}`} key={`${slug}-${section}`}>
          {section === 'About' && (
            <div className="space-y-5">
              <Field id="c-title" label="Content title"><input id="c-title" className="field-input" defaultValue="About the conference" /></Field>
              <Field id="c-body" label="Content"><textarea id="c-body" rows={10} className="field-input" defaultValue={slug === 'icicgb-26' ? icicgbAbout.join('\n\n') : `The ${conf.title} (${conf.acronym}), organized through the International Conference Forum (ICF), brings together scholars, researchers, academicians, and industry experts from around the world.`} /></Field>
            </div>
          )}
          {section === 'Highlights' && (
            <div className="space-y-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <label htmlFor={`h-${i}`} className="sr-only">Highlight {i + 1}</label>
                  <input id={`h-${i}`} className="field-input" value={h} onChange={(e) => setHighlights((hs) => hs.map((x, j) => (j === i ? e.target.value : x)))} />
                  <button onClick={() => setHighlights((hs) => hs.filter((_, j) => j !== i))} className="rounded p-2 text-danger hover:bg-danger/10" aria-label={`Remove highlight ${i + 1}`}><Trash2 className="size-4" /></button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setHighlights((hs) => [...hs, ''])}><Plus aria-hidden className="size-4" /> Add highlight</Button>
            </div>
          )}
          {section === 'Programme' && (
            <div className="space-y-5">
              <Field id="p-intro" label="Agenda introduction"><textarea id="p-intro" rows={4} className="field-input" defaultValue="Each conference follows an agenda tailored to its theme, objectives, and participating audience." /></Field>
              <Field id="p-hl" label="Key agenda highlights (one per line)"><textarea id="p-hl" rows={7} className="field-input" defaultValue={agendaHighlights.join('\n')} /></Field>
              <Field id="p-file" label="Programme PDF"><input id="p-file" type="file" accept="application/pdf" className="text-sm" /></Field>
            </div>
          )}
          {section === 'Venue' && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="v-name" label="Venue name"><input id="v-name" className="field-input" defaultValue={slug === 'icicgb-26' ? exampleVenue.name : ''} /></Field>
              <Field id="v-city" label="City"><input id="v-city" className="field-input" defaultValue={conf.city} /></Field>
              <div className="sm:col-span-2"><Field id="v-addr" label="Address"><textarea id="v-addr" rows={4} className="field-input" defaultValue={slug === 'icicgb-26' ? exampleVenue.lines.join('\n') : ''} /></Field></div>
              <Field id="v-map" label="Map link"><input id="v-map" className="field-input" placeholder="https://maps.google.com/…" /></Field>
              <Field id="v-tent" label="Venue status"><select id="v-tent" className="field-input"><option>Tentative</option><option>Confirmed</option></select></Field>
            </div>
          )}
          {section === 'Gallery' && (
            <div>
              <label htmlFor="g-up" className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-navy-100 bg-mist p-10 text-center text-sm text-muted hover:border-navy-800">
                <ImagePlus aria-hidden className="size-8 text-globe-600" strokeWidth={1.4} />
                <span className="font-semibold text-navy-900">Upload photographs</span>
                <span>JPG or PNG. Add alt text for each image after upload.</span>
              </label>
              <input id="g-up" type="file" multiple accept="image/jpeg,image/png" className="sr-only" onChange={(e) => toast(`${e.target.files?.length ?? 0} file(s) selected. Uploading is connected in a later phase.`)} />
              <p className="mt-4 text-sm text-muted">No photographs uploaded for {conf.acronym} yet.</p>
            </div>
          )}
          {section === 'SEO' && (
            <div className="grid gap-5">
              <Field id="s-title" label="Meta title"><input id="s-title" className="field-input" defaultValue={`${conf.title} (${conf.acronym}) | ICF`} /></Field>
              <Field id="s-desc" label="Meta description"><textarea id="s-desc" rows={3} className="field-input" defaultValue={`${conf.title}: call for papers, registration, programme and venue.`} /></Field>
              <Field id="s-kw" label="Meta keywords"><input id="s-kw" className="field-input" placeholder="conference, research, …" /></Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="s-og" label="OG title"><input id="s-og" className="field-input" defaultValue={conf.title} /></Field>
                <Field id="s-can" label="Canonical URL"><input id="s-can" className="field-input" defaultValue={`https://internationalconferenceforum.com/event/${conf.slug}`} /></Field>
                <Field id="s-rob" label="Robots"><select id="s-rob" className="field-input"><option>index, follow</option><option>noindex, nofollow</option></select></Field>
                <Field id="s-tw" label="Twitter card"><select id="s-tw" className="field-input"><option>summary_large_image</option><option>summary</option></select></Field>
              </div>
            </div>
          )}
        </Panel>
        <Panel title="Publish">
          <Field id="c-status" label="Content status">
            <select id="c-status" className="field-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Draft</option>
              <option>Published</option>
            </select>
          </Field>
          <p className="mt-3 text-sm text-muted">Last edited by ICF Administrator (sample).</p>
          <Button className="mt-5 w-full" onClick={() => toast(`${section} for ${conf.acronym} saved in this demo session.`)}>Save changes</Button>
        </Panel>
      </div>
    </>
  );
}
