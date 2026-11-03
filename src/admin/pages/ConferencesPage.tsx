import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { sampleConferences } from '@/data/conferences.sample';
import { countryByCode } from '@/data/countries';
import { topicBySlug } from '@/data/topics';
import { formatDateRange } from '@/utils/format';
import { Button, buttonClass } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AdminPageHeader, Panel, SegmentedFilter, StatusBadge, Table, td, th } from '../components/AdminUI';
import { useToast } from '../components/Toast';
import type { Conference } from '@/types';

const statuses = ['All', 'Published', 'Draft', 'Pending', 'Completed'] as const;

export default function ConferencesPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Conference[]>(sampleConferences);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<(typeof statuses)[number]>('All');
  const [confirm, setConfirm] = useState<Conference | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((c) => (status === 'All' || c.status === status) && (!s || `${c.title} ${c.acronym} ${c.city}`.toLowerCase().includes(s)));
  }, [rows, q, status]);

  return (
    <>
      <AdminPageHeader
        title="Conference management"
        intro="Create, edit and remove conferences, including dates, venue, fees and deadlines."
        actions={
          <Link to="/admin/conferences/new" className={buttonClass('primary', 'md')}>
            <Plus aria-hidden className="size-4" /> Add conference
          </Link>
        }
      />
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SegmentedFilter label="Filter by status" options={statuses} value={status} onChange={setStatus} />
        <div className="relative md:w-72">
          <label htmlFor="conf-search" className="sr-only">
            Search conferences
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input id="conf-search" className="field-input pl-9" placeholder="Search title, acronym or city" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <Panel bodyClass="p-0">
        <Table caption="Conferences">
          <thead>
            <tr>
              <th className={th}>Conference</th>
              <th className={th}>Subject area</th>
              <th className={th}>Dates</th>
              <th className={th}>Location</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-mist/60">
                <td className={td}>
                  <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                    {c.acronym}
                    {c.featured && <Star aria-label="Featured" className="size-3.5 fill-gold-400 text-gold-500" />}
                  </span>
                  <span className="block max-w-xs truncate text-xs text-muted">{c.title}</span>
                </td>
                <td className={td}>{topicBySlug(c.topicSlug)?.name}</td>
                <td className={`${td} whitespace-nowrap`}>{formatDateRange(c.startDate, c.endDate)}</td>
                <td className={td}>
                  {c.city}, {countryByCode(c.countryCode)?.name}
                </td>
                <td className={td}>
                  <StatusBadge status={c.status} />
                </td>
                <td className={`${td} text-right`}>
                  <div className="inline-flex gap-1">
                    <Link to={`/admin/conferences/${c.id}/edit`} className="rounded p-2 text-navy-800 hover:bg-navy-50" aria-label={`Edit ${c.acronym}`}>
                      <Pencil className="size-4" />
                    </Link>
                    <button onClick={() => setConfirm(c)} className="rounded p-2 text-danger hover:bg-danger/10" aria-label={`Delete ${c.acronym}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  No conferences match. Change the status filter or search term.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Panel>
      <p className="mt-3 text-sm text-muted">
        Showing {list.length} of {rows.length} conferences (sample data).
      </p>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete conference?">
        <p>
          <strong className="text-navy-900">{confirm?.acronym}</strong> and its page content will be removed from the website. Registrations already received are kept.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirm(null)}>
            Keep conference
          </Button>
          <Button
            className="!bg-danger hover:!bg-danger/90"
            onClick={() => {
              setRows((r) => r.filter((x) => x.id !== confirm!.id));
              toast(`${confirm!.acronym} deleted from this demo session.`);
              setConfirm(null);
            }}
          >
            Delete conference
          </Button>
        </div>
      </Modal>
    </>
  );
}
