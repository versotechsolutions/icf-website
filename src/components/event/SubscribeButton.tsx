import { useState } from 'react';
import { BellRing, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useEventSite } from '@/hooks/useEventSite';
import { useForm } from '@/hooks/useForm';
import { submitSubscription } from '@/services/subscriptions';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/Fields';
import { email, phone, required } from '@/utils/validation';

/**
 * Floating "Subscribe" button, fixed to the bottom-right corner of every event page so it stays visible while
 * scrolling. Opens a popup asking for name, email and mobile; on submit the conference and its event link are
 * added automatically (see services/subscriptions.ts).
 */
export function SubscribeButton() {
  const { conference, base } = useEventSite()!;
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const eventUrl = `${window.location.origin}${base}`;

  const form = useForm(
    { subName: '', subEmail: '', subMobile: '' },
    {
      subName: [required('your name')],
      subEmail: [required('your email address'), email],
      subMobile: [required('your mobile number'), phone],
    },
  );

  const close = () => {
    setOpen(false);
    setSentTo(null);
    form.reset();
  };

  const submit = form.handleSubmit(async (v) => {
    setSending(true);
    await submitSubscription({ name: v.subName, email: v.subEmail, mobile: v.subMobile, conference: `${conference.acronym}: ${conference.title}`, eventUrl });
    setSending(false);
    setSentTo(v.subName);
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-3 text-[0.95rem] font-bold text-navy-950 shadow-[var(--shadow-panel)] ring-2 ring-white transition-colors hover:bg-gold-300"
      >
        <BellRing aria-hidden className="size-[1.1rem]" />
        Subscribe
      </button>

      <Modal open={open} onClose={close} title={sentTo ? 'Subscribed' : `Subscribe to ${conference.acronym}`}>
        {sentTo ? (
          <div role="status">
            <CheckCircle2 aria-hidden className="size-9 text-success" />
            <p className="mt-3 text-ink/85">
              Thank you, {sentTo}. You are subscribed to updates for {conference.acronym}.
            </p>
            <p className="mt-3 text-sm text-muted">
              Frontend demonstration: nothing is sent yet. In the live site ICF will receive an email with your details and this event link:{' '}
              <span className="break-all font-semibold text-navy-900">{eventUrl}</span>
            </p>
            <div className="mt-5 flex justify-end border-t border-rule pt-4">
              <Button onClick={close}>Close</Button>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="grid gap-4">
            <p className="text-sm text-muted">Get updates about {conference.title}. All fields are required.</p>
            <TextField label="Name" required autoComplete="name" {...form.field('subName')} />
            <TextField label="Email address" required type="email" autoComplete="email" {...form.field('subEmail')} />
            <TextField label="Mobile number" required type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...form.field('subMobile')} />
            <div className="flex justify-end border-t border-rule pt-4">
              <Button type="submit" disabled={sending}>
                {sending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4" />}
                {sending ? 'Submitting…' : 'Submit'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
