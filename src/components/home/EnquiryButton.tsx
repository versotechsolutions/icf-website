import { useState } from 'react';
import { CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextAreaField, TextField } from '@/components/forms/Fields';
import { email, maxLength, minLength, phone, required } from '@/utils/validation';

/**
 * Small floating "Enquiry" button (home page) that opens a quick enquiry popup.
 * Frontend demo: the form validates in the browser and shows a thank-you; nothing is sent yet.
 */
export function EnquiryButton() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm(
    { enqName: '', enqMobile: '', enqEmail: '', enqMessage: '' },
    {
      enqName: [required('your name')],
      enqMobile: [required('your mobile number'), phone],
      enqEmail: [required('your email address'), email],
      enqMessage: [required('your enquiry'), minLength(10, 'Your enquiry'), maxLength(1000, 'Your enquiry')],
    },
  );

  const close = () => {
    setOpen(false);
    setSent(false);
    form.reset();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-panel)] ring-1 ring-gold-400/60 transition-colors hover:bg-navy-800"
        aria-haspopup="dialog"
      >
        <MessageSquare aria-hidden className="size-4 text-gold-300" />
        Enquiry
      </button>

      <Modal open={open} onClose={close} title={sent ? 'Thank you' : 'Send an enquiry'}>
        {sent ? (
          <div role="status">
            <CheckCircle2 aria-hidden className="size-9 text-success" />
            <p className="mt-3 text-ink/85">
              Thank you, {form.values.enqName}. We have received your enquiry and will get back to you at {form.values.enqEmail}.
            </p>
            <p className="mt-3 text-sm text-muted">Frontend demonstration: enquiries are not sent or stored yet.</p>
            <div className="mt-5 flex justify-end border-t border-rule pt-4">
              <Button onClick={close}>Close</Button>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={form.handleSubmit(() => setSent(true))} className="grid gap-4">
            <TextField label="Name" required autoComplete="name" {...form.field('enqName')} />
            <TextField label="Mobile number" required type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...form.field('enqMobile')} />
            <TextField label="Email address" required type="email" autoComplete="email" {...form.field('enqEmail')} />
            <TextAreaField label="Enquiry message" required rows={4} {...form.field('enqMessage')} />
            <div className="flex justify-end border-t border-rule pt-4">
              <Button type="submit">
                <Send aria-hidden className="size-4" />
                Submit
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
