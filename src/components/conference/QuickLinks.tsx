import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, Download, FileText } from 'lucide-react';
import { eventQuickLinks } from '@/data/site';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/Fields';
import { useForm } from '@/hooks/useForm';
import { email, phone, required } from '@/utils/validation';
import { cn } from '@/utils/cn';

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

/** "Quick Links" panel shown on the right of every event page (source: Quick Links.docx). */
export function QuickLinks({ className }: { className?: string }) {
  const [brochure, setBrochure] = useState(false);
  return (
    <aside aria-labelledby="quick-links" className={cn('rounded-[var(--radius-lg)] border border-rule bg-white', className)}>
      <h2 id="quick-links" className="border-b border-rule px-5 py-4 font-serif text-lg">
        Quick links
      </h2>
      <ul className="p-2">
        {eventQuickLinks.map((l) =>
          l.action === 'brochure' ? (
            <li key={l.label} className="mt-2 border-t border-rule px-1 pt-3">
              <Button variant="gold" className="w-full" onClick={() => setBrochure(true)}>
                <Download aria-hidden className="size-4" />
                {l.label}
              </Button>
            </li>
          ) : (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-[var(--radius-sm)] border-l-2 px-3 py-2.5 text-[0.95rem] font-semibold',
                    isActive ? 'border-gold-500 bg-mist text-navy-900' : 'border-transparent text-ink/80 hover:bg-mist hover:text-navy-900',
                  )
                }
              >
                <FileText aria-hidden className="size-4 text-globe-600" />
                {l.label}
              </NavLink>
            </li>
          ),
        )}
      </ul>
      <Modal open={brochure} onClose={() => setBrochure(false)} title="Download brochure">
        {brochure && <BrochureForm onDone={() => setBrochure(false)} />}
      </Modal>
    </aside>
  );
}
