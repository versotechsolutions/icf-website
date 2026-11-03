import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Globe, Mail, MapPin, Phone, Send } from 'lucide-react';
import { contactIntro, enquiryTypes } from '@/data/content';
import { site } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useForm } from '@/hooks/useForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { CheckboxField, SelectField, TextAreaField, TextField } from '@/components/forms/Fields';
import { CountryCombobox } from '@/components/forms/CountryCombobox';
import { checked, email, maxLength, minLength, phone, required, selectRequired } from '@/utils/validation';

const enquiryFromParam: Record<string, string> = {
  partnership: 'Partnership / Collaboration',
  registration: 'Conference Registration',
  submission: 'Paper Submission',
};

export default function ContactPage() {
  usePageMeta('Contact us', 'Contact International Conference Forum (ICF) about registration, paper submission, upcoming conferences or collaboration.');
  const [params] = useSearchParams();
  const [sent, setSent] = useState(false);

  const form = useForm(
    {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      organisation: '',
      subject: '',
      enquiryType: enquiryFromParam[params.get('enquiry') ?? ''] ?? '',
      message: '',
      consent: 'false',
    },
    {
      fullName: [required('your full name')],
      email: [required('your email address'), email],
      phone: [phone],
      country: [selectRequired('your country')],
      organisation: [],
      subject: [required('a subject'), maxLength(150, 'Subject')],
      enquiryType: [selectRequired('an enquiry type')],
      message: [required('your message'), minLength(20, 'Your message'), maxLength(2000, 'Your message')],
      consent: [checked('Agree to the Privacy Policy so we can respond to your enquiry.')],
    },
  );

  return (
    <>
      <PageHeader title="Contact us" crumbs={[{ label: 'Contact us' }]} intro={contactIntro[0]} />
      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <section aria-labelledby="form-h">
          <h2 id="form-h" className="text-h2">
            Send an enquiry
          </h2>
          <p className="mt-3 max-w-[60ch] text-muted">{contactIntro[1]} Fields marked * are required.</p>
          <Notice tone="sample" className="mt-6">
            Frontend demonstration: the form validates in the browser but does not send or store enquiries yet.
          </Notice>

          {sent ? (
            <div role="status" className="mt-8 rounded-[var(--radius-lg)] border border-success/30 bg-success/5 p-8">
              <CheckCircle2 aria-hidden className="size-9 text-success" />
              <h3 className="mt-4 text-h3">Enquiry ready to send</h3>
              <p className="mt-2 text-ink/85">
                Thank you, {form.values.fullName}. In the live site your {form.values.enquiryType.toLowerCase()} enquiry will be sent to the ICF team, and a confirmation emailed to {form.values.email}.
              </p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={() => {
                  form.reset();
                  setSent(false);
                }}
              >
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={form.handleSubmit(() => setSent(true))} className="mt-8 grid gap-5 sm:grid-cols-2">
              {form.submitted && form.errorCount > 0 && (
                <div role="alert" className="rounded-[var(--radius-md)] border border-danger/40 bg-danger/5 px-4 py-3 text-[0.95rem] text-danger sm:col-span-2">
                  {form.errorCount === 1 ? 'One field needs attention.' : `${form.errorCount} fields need attention.`} Check the highlighted fields below.
                </div>
              )}
              <TextField label="Full name" required autoComplete="name" {...form.field('fullName')} />
              <TextField label="Email address" required type="email" autoComplete="email" {...form.field('email')} />
              <TextField label="Phone number" type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...form.field('phone')} />
              <CountryCombobox
                id="f-country"
                label="Country"
                required
                valueKey="name"
                value={form.values.country}
                onChange={(v) => form.set('country', v)}
                onBlur={form.field('country').onBlur}
                error={form.errors.country}
              />
              <TextField label="Organisation / institution" autoComplete="organization" className="sm:col-span-2" {...form.field('organisation')} />
              <TextField label="Subject" required {...form.field('subject')} />
              <SelectField label="Enquiry type" required placeholder="Choose an enquiry type" options={[...enquiryTypes]} {...form.field('enquiryType')} />
              <TextAreaField label="Your message" required className="sm:col-span-2" hint={`${form.values.message.length} / 2000 characters`} {...form.field('message')} />
              <div className="sm:col-span-2">
                <CheckboxField
                  id="f-consent"
                  name="consent"
                  checked={form.values.consent === 'true'}
                  onChange={form.field('consent').onChange}
                  onBlur={form.field('consent').onBlur}
                  error={form.errors.consent}
                  label={
                    <>
                      I agree to ICF using these details to respond to my enquiry, as described in the{' '}
                      <Link to="/policies/privacy" className="link-underline">
                        Privacy Policy
                      </Link>
                      .
                    </>
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">
                  <Send aria-hidden className="size-4" />
                  Submit enquiry
                </Button>
              </div>
            </form>
          )}
        </section>

        <aside aria-labelledby="info-h" className="self-start lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-navy-900 text-white">
            <div className="p-7 sm:p-8">
              <h2 id="info-h" className="text-h3 text-white">
                Contact information
              </h2>
              <p className="mt-2 text-white/70">If you have any questions or need assistance, please contact us.</p>
              <ul className="mt-6 space-y-5">
                <li className="flex gap-4">
                  <Mail aria-hidden className="mt-1 size-5 shrink-0 text-gold-300" />
                  <div>
                    <p className="text-sm text-white/60">Participant support</p>
                    <a href={`mailto:${site.contact.supportEmail}`} className="font-semibold hover:underline">
                      support@
                      <wbr />
                      {site.domain}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail aria-hidden className="mt-1 size-5 shrink-0 text-gold-300" />
                  <div>
                    <p className="text-sm text-white/60">General enquiries</p>
                    <a href={`mailto:${site.contact.generalEmail}`} className="font-semibold hover:underline">
                      {site.contact.generalEmail}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone aria-hidden className="mt-1 size-5 shrink-0 text-gold-300" />
                  <div>
                    <p className="text-sm text-white/60">Phone</p>
                    <a href={site.contact.phoneHref} className="font-semibold hover:underline">
                      {site.contact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Globe aria-hidden className="mt-1 size-5 shrink-0 text-gold-300" />
                  <div>
                    <p className="text-sm text-white/60">Website</p>
                    <p className="font-semibold">{site.domain}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-gold-300" />
                  <div>
                    <p className="text-sm text-white/60">Location</p>
                    <p className="font-semibold">{site.contact.city}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="border-t border-white/10 bg-navy-950/40 p-7 sm:px-8">
              <h3 className="font-serif text-lg font-semibold text-white">Social media</h3>
              <p className="mt-1 text-sm text-white/70">Stay updated on the latest ICF news and events.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {site.social.map((s) => (
                  <li key={s.name} className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/60" title="Profile link to be supplied by ICF">
                    {s.name} (link pending)
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 px-1 text-[0.95rem] leading-relaxed text-muted">
            Feel free to contact us for questions about paper submissions, registration, conference details, or any other related matters. We look forward to assisting you!
          </p>
        </aside>
      </Container>
    </>
  );
}
