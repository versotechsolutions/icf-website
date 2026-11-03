import { useState } from 'react';
import { Eye, Send } from 'lucide-react';
import { emailLog, emailTemplates, type EmailTemplate } from '@/data/admin.sample';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader, Panel, StatusBadge, Table, td, th } from '../components/AdminUI';
import { useToast } from '../components/Toast';
import { cn } from '@/utils/cn';

const sampleValues: Record<string, string> = {
  participant_name: 'Dr. Meera Iyer',
  conference_title: 'International Conference on Innovation and Competition in Global Banking',
  conference_acronym: 'ICICGB-26',
  conference_date: '14 Dec 2026',
  registration_ref: 'ICF-R-2448',
  amount: 'USD 319.00',
};
const fill = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => sampleValues[k] ?? `{{${k}}}`);

export default function EmailsPage() {
  const toast = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(emailTemplates);
  const [activeId, setActiveId] = useState(templates[0].id);
  const [preview, setPreview] = useState(false);
  const active = templates.find((t) => t.id === activeId)!;
  const update = (patch: Partial<EmailTemplate>) => setTemplates((ts) => ts.map((t) => (t.id === activeId ? { ...t, ...patch } : t)));

  return (
    <>
      <AdminPageHeader title="Email notifications" intro="Edit the automatic emails sent to participants and review recent sends." />
      <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <Panel title="Templates" bodyClass="p-2">
          <ul>
            {templates.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => { setActiveId(t.id); setPreview(false); }}
                  aria-current={t.id === activeId ? 'true' : undefined}
                  className={cn('w-full rounded-[var(--radius-sm)] border-l-2 px-3 py-2.5 text-left', t.id === activeId ? 'border-gold-500 bg-mist' : 'border-transparent hover:bg-mist/70')}
                >
                  <span className="block font-semibold text-navy-900">{t.name}</span>
                  <span className="block text-xs text-muted">{t.trigger}</span>
                  <span className={cn('mt-1 inline-block text-xs font-semibold', t.enabled ? 'text-success' : 'text-muted')}>{t.enabled ? 'On' : 'Off'}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={active.name}
          action={
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="size-4 accent-navy-900" checked={active.enabled} onChange={(e) => update({ enabled: e.target.checked })} />
              Send automatically
            </label>
          }
        >
          <p className="text-sm text-muted">Trigger: {active.trigger}</p>
          {preview ? (
            <div className="mt-5 rounded-[var(--radius-md)] border border-rule">
              <div className="border-b border-rule bg-mist px-5 py-3 text-sm">
                <p><span className="text-muted">From:</span> ICF &lt;support@internationalconferenceforum.com&gt;</p>
                <p><span className="text-muted">Subject:</span> <strong>{fill(active.subject)}</strong></p>
              </div>
              <div className="whitespace-pre-line px-5 py-5 leading-relaxed">{fill(active.body)}</div>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="t-subject" className="text-[0.92rem] font-semibold text-navy-900">Subject</label>
                <input id="t-subject" className="field-input" value={active.subject} onChange={(e) => update({ subject: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="t-body" className="text-[0.92rem] font-semibold text-navy-900">Message</label>
                <textarea id="t-body" rows={10} className="field-input font-[inherit]" value={active.body} onChange={(e) => update({ body: e.target.value })} />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">Merge fields</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {Object.keys(sampleValues).map((k) => (
                    <li key={k}>
                      <button type="button" onClick={() => update({ body: `${active.body}{{${k}}}` })} className="rounded-full bg-globe-100 px-2.5 py-1 font-mono text-xs text-globe-700 hover:bg-globe-600 hover:text-white">
                        {`{{${k}}}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-rule pt-5">
            <Button onClick={() => toast(`${active.name} template saved in this demo session.`)}>Save template</Button>
            <Button variant="secondary" onClick={() => setPreview((p) => !p)}>
              <Eye aria-hidden className="size-4" /> {preview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="ghost" onClick={() => toast('Test email not sent: email delivery is connected in a later phase.')}>
              <Send aria-hidden className="size-4" /> Send test email
            </Button>
          </div>
        </Panel>
      </div>

      <Panel title="Recent notifications" className="mt-6" bodyClass="p-0">
        <Table caption="Recent email notifications">
          <thead>
            <tr>
              <th className={th}>Template</th>
              <th className={th}>Recipient</th>
              <th className={th}>Date</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {emailLog.map((e) => (
              <tr key={e.id}>
                <td className={`${td} font-semibold text-navy-900`}>{e.template}</td>
                <td className={td}>{e.to}</td>
                <td className={`${td} tabular-nums`}>{e.date}</td>
                <td className={td}><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </>
  );
}
