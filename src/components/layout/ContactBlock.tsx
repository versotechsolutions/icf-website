import { Globe, Mail, Phone } from 'lucide-react';
import { closingLine } from '@/data/content';
import { site } from '@/data/site';
import { cn } from '@/utils/cn';

/**
 * The "Contact Us" block that closes most event-site documents
 * (Video Conferencing, FAQ, Submission, Registration). Uses confirmed contact details only.
 */
export function ContactBlock({ intro, className, closing = closingLine }: { intro?: string; className?: string; closing?: string }) {
  return (
    <section aria-labelledby="contact-block" className={cn('rounded-[var(--radius-lg)] border border-rule bg-mist p-6 sm:p-8', className)}>
      <h2 id="contact-block" className="text-h3">
        Contact us
      </h2>
      <p className="mt-2 max-w-[62ch] text-muted">
        {intro ?? 'For further enquiries or support related to International Conference Forum events, please contact us.'}
      </p>
      <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
        <div className="flex gap-3">
          <Mail aria-hidden className="mt-1 size-4 shrink-0 text-gold-700" />
          <div>
            <dt className="text-sm text-muted">Email</dt>
            <dd>
              <a className="link-underline" href={`mailto:${site.contact.supportEmail}`}>
                support@<wbr />
                {site.domain}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex gap-3">
          <Phone aria-hidden className="mt-1 size-4 shrink-0 text-gold-700" />
          <div>
            <dt className="text-sm text-muted">Phone</dt>
            <dd>
              <a className="link-underline" href={site.contact.phoneHref}>
                {site.contact.phone}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex gap-3">
          <Globe aria-hidden className="mt-1 size-4 shrink-0 text-gold-700" />
          <div>
            <dt className="text-sm text-muted">Website</dt>
            <dd>{site.domain}</dd>
          </div>
        </div>
      </dl>
      {closing && <p className="mt-6 border-t border-rule pt-5 font-serif text-lg italic text-navy-800">{closing}</p>}
    </section>
  );
}
