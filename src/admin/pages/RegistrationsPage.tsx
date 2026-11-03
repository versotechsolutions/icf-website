import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { adminRegistrations } from '@/data/admin.sample';
import { sampleConferences } from '@/data/conferences.sample';
import { registrationFees } from '@/data/content';
import { formatUsd } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { AdminPageHeader, Panel, StatusBadge, Table, downloadCsv, td, th } from '../components/AdminUI';
import { useToast } from '../components/Toast';

const PAGE = 12;

export default function RegistrationsPage() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [conf, setConf] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return adminRegistrations.filter(
      (r) =>
        (!conf || r.conferenceSlug === conf) &&
        (!cat || r.category === cat) &&
        (!status || r.status === status) &&
        (!s || `${r.ref} ${r.name} ${r.email} ${r.institution}`.toLowerCase().includes(s)),
    );
  }, [q, conf, cat, status]);
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const shown = list.slice((page - 1) * PAGE, page * PAGE);
  const acronym = (slug: string) => sampleConferences.find((c) => c.slug === slug)?.acronym ?? slug;

  const exportCsv = () => {
    downloadCsv(
      'icf-registrations-sample.csv',
      list.map((r) => ({ Reference: r.ref, Name: r.name, Email: r.email, Country: r.country, Institution: r.institution, Conference: acronym(r.conferenceSlug), Category: r.category, Period: r.period, AmountUSD: r.amount, Status: r.status, Date: r.date })),
    );
    toast(`Exported ${list.length} sample registrations to CSV.`);
  };

  const sel = 'field-input py-2 text-sm';
  return (
    <>
      <AdminPageHeader
        title="Registration management"
        intro="View participant details, registration categories and status."
        actions={
          <Button variant="secondary" onClick={exportCsv}>
            <Download aria-hidden className="size-4" /> Export CSV
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="relative">
          <label htmlFor="r-q" className="sr-only">Search registrations</label>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input id="r-q" className={`${sel} pl-9`} placeholder="Name, email, reference or institution" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <select aria-label="Conference" className={sel} value={conf} onChange={(e) => { setConf(e.target.value); setPage(1); }}>
          <option value="">All conferences</option>
          {Array.from(new Set(adminRegistrations.map((r) => r.conferenceSlug))).map((s) => <option key={s} value={s}>{acronym(s)}</option>)}
        </select>
        <select aria-label="Category" className={sel} value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {registrationFees.map((f) => <option key={f.category}>{f.category}</option>)}
        </select>
        <select aria-label="Status" className={sel} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option>Confirmed</option>
          <option>Awaiting payment</option>
          <option>Cancelled</option>
        </select>
      </div>
      <Panel bodyClass="p-0">
        <Table caption="Registrations">
          <thead>
            <tr>
              <th className={th}>Reference</th>
              <th className={th}>Participant</th>
              <th className={th}>Institution</th>
              <th className={th}>Conference</th>
              <th className={th}>Category</th>
              <th className={`${th} text-right`}>Fee</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.ref} className="hover:bg-mist/60">
                <td className={`${td} font-semibold text-navy-900`}>
                  {r.ref}
                  <span className="block text-xs font-normal text-muted tabular-nums">{r.date}</span>
                </td>
                <td className={td}>
                  {r.name}
                  <span className="block text-xs text-muted">{r.email}</span>
                </td>
                <td className={td}>
                  {r.institution}
                  <span className="block text-xs text-muted">{r.country}</span>
                </td>
                <td className={td}>{acronym(r.conferenceSlug)}</td>
                <td className={td}>
                  {r.category}
                  <span className="block text-xs text-muted">{r.period}</span>
                </td>
                <td className={`${td} text-right tabular-nums`}>{formatUsd(r.amount)}</td>
                <td className={td}><StatusBadge status={r.status} /></td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted">No registrations match these filters.</td></tr>
            )}
          </tbody>
        </Table>
      </Panel>
      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted">{list.length} registrations (sample data)</p>
        <Pagination page={page} totalPages={pages} onChange={setPage} />
      </div>
    </>
  );
}
