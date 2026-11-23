import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircleQuestionMark, MonitorPlay, Phone, type LucideIcon } from 'lucide-react';
import { site } from '@/data/site';
import { Container } from '@/components/ui/Container';
import { UtilityBar } from '@/components/layout/Header';
import type { Conference } from '@/types';

/** Event site brand: ICF emblem with the conference's short name, linking to the event home. */
export function EventBrand({ conference, base }: { conference: Conference; base: string }) {
  return (
    <Link to={base} className="inline-flex shrink-0 items-center gap-3" aria-label={`${conference.acronym}, conference home`}>
      <img src="/images/icf-emblem.webp" alt="" width={400} height={181} className="h-10 w-auto sm:h-11" />
      <span className="border-l border-rule pl-3 leading-tight" aria-hidden>
        <span className="block font-serif text-[1.1rem] font-bold text-navy-900">{conference.acronym}</span>
        <span className="hidden text-[0.72rem] font-semibold text-muted sm:block">International Conference Forum</span>
      </span>
    </Link>
  );
}

function MastheadItem({ icon: Icon, title, detail, to, href }: { icon: LucideIcon; title: string; detail: ReactNode; to?: string; href?: string }) {
  const body = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy-900 text-white transition-colors group-hover:bg-globe-700">
        <Icon aria-hidden className="size-5" strokeWidth={1.8} />
      </span>
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[0.95rem] font-bold text-navy-900">{title}</span>
        <span className="mt-0.5 block whitespace-nowrap text-[0.85rem] text-muted group-hover:text-globe-700">{detail}</span>
      </span>
    </>
  );
  const cls = 'group flex items-center gap-3';
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {body}
    </a>
  );
}

/** Large-screen header row beside the brand: Video Conference, Conference FAQ, phone and email. */
export function EventMasthead({ base }: { base: string }) {
  return (
    <ul className="flex items-center gap-6 2xl:gap-9">
      <li>
        <MastheadItem icon={MonitorPlay} title="Video Conference" detail="Join sessions online" to={`${base}/video-conferencing`} />
      </li>
      <li>
        <MastheadItem icon={MessageCircleQuestionMark} title="Conference FAQ" detail="Common questions" to={`${base}/faq`} />
      </li>
      <li>
        <MastheadItem icon={Phone} title="Phone" detail={site.contact.phone} href={site.contact.phoneHref} />
      </li>
      <li>
        <MastheadItem icon={Mail} title="Mail to" detail={site.contact.supportEmail} href={`mailto:${site.contact.supportEmail}`} />
      </li>
    </ul>
  );
}

/** Compact top bar of the event site on phones and tablets: phone, email, Video Conference and Conference FAQ. */
export function EventUtilityBar({ base }: { base: string }) {
  return (
    <UtilityBar className="xl:hidden">
      <div className="flex items-center gap-4 whitespace-nowrap sm:gap-5">
        <Link to={`${base}/video-conferencing`} className="inline-flex items-center gap-1.5 hover:text-white">
          <MonitorPlay aria-hidden className="size-3.5 text-gold-400" />
          <span className="sr-only md:not-sr-only">Video Conference</span>
        </Link>
        <Link to={`${base}/faq`} className="inline-flex items-center gap-1.5 hover:text-white">
          <MessageCircleQuestionMark aria-hidden className="size-3.5 text-gold-400" />
          <span className="hidden md:inline">Conference FAQ</span>
          <span className="md:hidden">FAQ</span>
        </Link>
      </div>
    </UtilityBar>
  );
}

/** Event site footer (source: Event Details page.docx, "Footer: Cont No, Email"). */
export function EventFooter({ conference, base }: { conference: Conference; base: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-[0.95rem] text-white/80">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.3fr]">
        <div className="md:col-span-2 lg:col-span-1">
          <p className="text-left font-serif text-xl font-bold text-white">{conference.acronym}</p>
          <p className="mt-2 max-w-md text-left leading-relaxed text-white/75">{conference.title}, organized through the International Conference Forum (ICF).</p>
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold text-white">More information</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to={`${base}/faq`} className="text-white/75 hover:text-white hover:underline">
                Conference FAQ
              </Link>
            </li>
            <li>
              <Link to={`${base}/invitation-letter`} className="text-white/75 hover:text-white hover:underline">
                Invitation letter
              </Link>
            </li>
            <li>
              <Link to="/" className="text-white/75 hover:text-white hover:underline">
                ICF main website
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold text-white">Contact</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3">
              <Phone aria-hidden className="mt-1 size-4 shrink-0 text-gold-400" />
              <a href={site.contact.phoneHref} className="text-white hover:underline">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden className="mt-1 size-4 shrink-0 text-gold-400" />
              <a href={`mailto:${site.contact.supportEmail}`} className="whitespace-nowrap text-white hover:underline max-[359px]:text-[0.8rem]">
                {site.contact.supportEmail}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-5 text-sm text-white/60">
          <p className="text-left">
            © {year} {site.name} ({site.shortName}). All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
