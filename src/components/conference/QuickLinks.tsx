import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Link2,
  Mail,
  Megaphone,
  Trophy,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { eventQuickLinks } from '@/data/site';
import { useSitePath } from '@/hooks/useEventSite';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/Fields';
import { useForm } from '@/hooks/useForm';
import { email, phone, required } from '@/utils/validation';
import { cn } from '@/utils/cn';

/** Icon for each quick link, keyed by its route. */
const linkIcons: Record<string, LucideIcon> = {
  '/call-for-papers': Megaphone,
  '/paper-submission': FileText,
  '/registration': UserPlus,
  '/programme': CalendarDays,
  '/invitation-letter': Mail,
  '/awards': Trophy,
};

function BrochureForm({ onDone }: { onDone: () => void }) {
  const [sent, setSent] = useState(false);
  const form = useForm(
    { name: '', email: '', phone: '', institution: '' },
    { name: [required('your full name')], email: [required('your email address'), email], phone: [phone], institution: [] },
  );

  if (sent)
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="flex items-start gap-2 text-navy-900">
          <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
          Request recorded in this demonstration. In the live site the brochure will be emailed to {form.values.email}.
        </p>
        <Button variant="secondary" onClick={onDone}>
          Close
        </Button>
      </div>
    );

  return (
    <form noValidate onSubmit={form.handleSubmit(() => setSent(true))} className="grid gap-4">
      <p className="text-sm text-muted">Share your details to receive the conference brochure. Fields marked * are required.</p>
      <TextField label="Full name" required autoComplete="name" {...form.field('name')} />
      <TextField label="Email address" required type="email" autoComplete="email" {...form.field('email')} />
      <TextField label="Phone number" type="tel" autoComplete="tel" {...form.field('phone')} />
      <TextField label="Organisation / institution" autoComplete="organization" {...form.field('institution')} />
      <p className="text-xs text-muted">Frontend demonstration: nothing is sent or stored.</p>
      <Button type="submit" className="justify-self-start">
        <Download aria-hidden className="size-4" />
        Request brochure
      </Button>
    </form>
  );
}

/** "Quick Links" card shown on the right of every event page (source: Quick Links.docx; design: client reference image). */
export function QuickLinks({ className }: { className?: string }) {
  const [brochure, setBrochure] = useState(false);
  const sitePath = useSitePath();
  const links = eventQuickLinks.filter((l) => !l.action);
  const brochureLink = eventQuickLinks.find((l) => l.action === 'brochure');

  return (
    <aside
      aria-labelledby="quick-links"
      className={cn(
        'overflow-hidden rounded-[1.25rem] border border-[#d9e5f7] bg-white shadow-[0_22px_48px_-24px_rgba(22,90,200,0.45)]',
        className,
      )}
    >
      {/* Header: blue gradient with soft wave accents */}
      <div className="relative overflow-hidden bg-[linear-gradient(120deg,#0a3a8f_0%,#0f4fb8_55%,#1667db_100%)] px-5 py-4">
        <svg aria-hidden viewBox="0 0 300 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M80 80 C150 70 190 30 300 22 V80 Z" fill="#1aa3f0" opacity="0.35" />
          <path d="M140 80 C200 74 240 48 300 44 V80 Z" fill="#22b8f5" opacity="0.4" />
          <path d="M60 80 C140 76 200 58 300 36" fill="none" stroke="#7fd3ff" strokeOpacity="0.45" strokeWidth="1.2" />
        </svg>
        <div className="relative flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.7rem] border border-[#7fc4ff]/70 bg-[linear-gradient(140deg,#2b8df2,#0d5bd0)] shadow-[0_4px_10px_-4px_rgba(0,30,90,0.6),inset_0_1px_0_rgba(255,255,255,0.35)]">
            <Link2 aria-hidden className="size-5 -rotate-45 text-white" strokeWidth={2.4} />
          </span>
          <h2 id="quick-links" className="font-serif text-[1.45rem] font-bold leading-none text-white">
            Quick Links
          </h2>
        </div>
      </div>

      <div className="p-4">
        <ul className="space-y-2.5">
          {links.map((l) => {
            const Icon = linkIcons[l.to] ?? FileText;
            return (
              <li key={l.to}>
                <NavLink
                  to={sitePath(l.to)}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3.5 rounded-[0.8rem] border px-3.5 py-3 shadow-[0_1px_2px_rgba(20,70,160,0.06)] transition-all duration-200',
                      'hover:translate-x-0.5 hover:border-[#b6cdf1] hover:bg-[#eaf2fd]',
                      isActive ? 'border-[#a9c5ef] bg-[#e7f0fd]' : 'border-[#d6e3f7] bg-[linear-gradient(180deg,#ffffff,#f3f7fd)]',
                    )
                  }
                >
                  <Icon aria-hidden className="size-[1.4rem] shrink-0 text-[#1a5fd0]" strokeWidth={2.2} />
                  <span className="flex-1 text-[0.98rem] font-semibold leading-snug text-[#0b1f4f]">{l.label}</span>
                  <ChevronRight aria-hidden className="size-4 shrink-0 text-[#0b2a6b] transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                </NavLink>
              </li>
            );
          })}
        </ul>

        {brochureLink && (
          <button
            type="button"
            onClick={() => setBrochure(true)}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-[0.9rem] bg-[linear-gradient(180deg,#ffd862_0%,#f3b733_55%,#d99410_100%)] px-4 py-3.5 text-[1rem] font-bold text-[#0b1f4f] shadow-[0_12px_22px_-12px_rgba(200,135,15,0.85),inset_0_1px_0_rgba(255,255,255,0.45)] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-105"
          >
            <Download aria-hidden className="size-5" strokeWidth={2.4} />
            {brochureLink.label}
          </button>
        )}
      </div>

      <Modal open={brochure} onClose={() => setBrochure(false)} title="Download brochure">
        {brochure && <BrochureForm onDone={() => setBrochure(false)} />}
      </Modal>
    </aside>
  );
}
