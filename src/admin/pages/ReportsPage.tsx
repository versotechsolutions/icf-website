import { useMemo, useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { adminPayments, adminRegistrations } from '@/data/admin.sample';
import { registrationFees } from '@/data/content';
import { sampleConferences } from '@/data/conferences.sample';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader, Panel, Table, downloadCsv, td, th } from '../components/AdminUI';
import { BarList } from '../components/Charts';
import { useToast } from '../components/Toast';

/** Standard reports and CSV downloads. Advanced revenue analytics are outside the agreed scope. */
export default function ReportsPage() {
  const toast = useToast();
  const [conf, setConf] = useState('');
  const regs = useMemo(() => adminRegistrations.filter((r) => !conf || r.conferenceSlug === conf), [conf]);
  const pays = useMemo(() => adminPayments.filter((p) => regs.some((r) => r.ref === p.regRef)), [regs]);
  const acronym = (slug: string) => sampleConferences.find((c) => c.slug === slug)?.acronym ?? slug;

  const byCategory = registrationFees.map((f) => ({ label: f.category, value: regs.filter((r) => r.category === f.category).length })).sort((a, b) => b.value - a.value);
  const conferenceRows = Array.from(new Set(adminRegistrations.map((r) => r.conferenceSlug))).map((slug) => {
    const rs = adminRegistrations.filter((r) => r.conferenceSlug === slug);
    return {
      slug,
      total: rs.length,
      confirmed: rs.filter((r) => r.status === 'Confirmed').length,
      awaiting: rs.filter((r) => r.status === 'Awaiting payment').length,
      cancelled: rs.filter((r) => r.status === 'Cancelled').length,
    };
  });

  const reports = [
    { name: 'Registrations report', desc: 'All registrations with participant and category details', run: () => downloadCsv('icf-registrations-report-sample.csv', regs.map((r) => ({ Reference: r.ref, Name: r.name, Conference: acronym(r.conferenceSlug), Category: r.category, Status: r.status, Date: r.date }))) },
    { name: 'Payment status report', desc: 'Transactions with registration references and status', run: () => downloadCsv('icf-payments-report-sample.csv', pays.map((p) => ({ Transaction: p.txn, Registration: p.regRef, Name: p.name, Method: p.method, AmountUSD: p.amount, Status: p.status, Date: p.date }))) },
    { name: 'Conference summary', desc: 'Registration counts per conference', run: () => downloadCsv('icf-conference-summary-sample.csv', conferenceRows.map((c) => ({ Conference: acronym(c.slug), Total: c.total, Confirmed: c.confirmed, AwaitingPayment: c.awaiting, Cancelled: c.cancelled }))) },
  ];

  return (
    <>
      <AdminPageHeader
        title="Reports"
        intro="Download registration and payment reports, and review conference-wise counts."
        actions={
          <select aria-label="Conference" className="field-input py-2 text-sm" value={conf} onChange={(e) => setConf(e.target.value)}>
            <option value="">All conferences</option>
            {conferenceRows.map((c) => <option key={c.slug} value={c.slug}>{acronym(c.slug)}</option>)}
          </select>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel title="Registrations by category">
          <BarList data={byCategory} valueLabel="Registrations" title={`${regs.length} registrations${conf ? ` for ${acronym(conf)}` : ''} (sample data)`} />
        </Panel>
        <Panel title="Download reports" bodyClass="p-0">
          <ul className="divide-y divide-rule">
            {reports.map((r) => (
              <li key={r.name} className="flex items-center gap-4 px-5 py-4">
                <FileSpreadsheet aria-hidden className="size-6 shrink-0 text-globe-600" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="font-semibold text-navy-900">{r.name}</p>
                  <p className="text-sm text-muted">{r.desc}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => { r.run(); toast(`${r.name} downloaded (sample data).`); }}>
                  <Download aria-hidden className="size-4" /> CSV
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title="Conference-wise registrations" className="mt-6" bodyClass="p-0">
        <Table caption="Registrations per conference">
          <thead>
            <tr>
              <th className={th}>Conference</th>
              <th className={`${th} text-right`}>Total</th>
              <th className={`${th} text-right`}>Confirmed</th>
              <th className={`${th} text-right`}>Awaiting payment</th>
              <th className={`${th} text-right`}>Cancelled</th>
            </tr>
          </thead>
          <tbody>
            {conferenceRows.map((c) => (
              <tr key={c.slug}>
                <td className={`${td} font-semibold text-navy-900`}>{acronym(c.slug)}</td>
                <td className={`${td} text-right tabular-nums`}>{c.total}</td>
                <td className={`${td} text-right tabular-nums`}>{c.confirmed}</td>
                <td className={`${td} text-right tabular-nums`}>{c.awaiting}</td>
                <td className={`${td} text-right tabular-nums`}>{c.cancelled}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </>
  );
}
