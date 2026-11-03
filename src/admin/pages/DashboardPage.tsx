import { Link } from 'react-router-dom';
import { CalendarCheck2, CalendarRange, CreditCard, FileClock, Plus, Users } from 'lucide-react';
import { sampleConferences } from '@/data/conferences.sample';
import { adminPayments, adminRegistrations } from '@/data/admin.sample';
import { countryByCode } from '@/data/countries';
import { formatDateRange, formatMonthKey } from '@/utils/format';
import { buttonClass } from '@/components/ui/Button';
import { AdminPageHeader, Panel, StatCard, StatusBadge, Table, td, th } from '../components/AdminUI';
import { ColumnChart } from '../components/Charts';

export default function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10);
  const by = (s: string) => sampleConferences.filter((c) => c.status === s).length;
  const upcoming = sampleConferences.filter((c) => c.status === 'Published' && c.startDate >= today);
  const completed = sampleConferences.filter((c) => c.status === 'Completed' || c.endDate < today).length;
  const successful = adminPayments.filter((p) => p.status === 'Successful').length;
  const pendingPay = adminPayments.filter((p) => p.status === 'Pending').length;

  const monthKeys = Array.from(new Set(adminRegistrations.map((r) => r.date.slice(0, 7)))).sort();
  const perMonth = monthKeys.map((m) => ({ label: formatMonthKey(m).slice(0, 3), value: adminRegistrations.filter((r) => r.date.startsWith(m)).length }));

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        intro="An overview of conferences, registrations and payments."
        actions={
          <Link to="/admin/conferences/new" className={buttonClass('primary', 'md')}>
            <Plus aria-hidden className="size-4" /> Add conference
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total conferences" value={sampleConferences.length} note={`${by('Published')} published, ${by('Draft')} draft, ${by('Pending')} pending`} icon={CalendarRange} />
        <StatCard label="Upcoming conferences" value={upcoming.length} note={`${completed} completed`} icon={CalendarCheck2} />
        <StatCard label="Registrations" value={adminRegistrations.length} note={`${adminRegistrations.filter((r) => r.status === 'Awaiting payment').length} awaiting payment`} icon={Users} />
        <StatCard label="Successful payments" value={successful} note={`${pendingPay} pending verification`} icon={CreditCard} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Registrations per month">
          <ColumnChart data={perMonth} valueLabel="Registrations" title="New registrations by month, May to October 2026 (sample data)" />
        </Panel>
        <Panel title="Next conferences" action={<Link to="/admin/conferences" className="text-sm font-semibold text-globe-700 hover:underline">All conferences</Link>} bodyClass="p-0">
          <ul className="divide-y divide-rule">
            {upcoming.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900">{c.acronym}</p>
                  <p className="truncate text-sm text-muted">
                    {formatDateRange(c.startDate, c.endDate)}, {c.city}, {countryByCode(c.countryCode)?.name}
                  </p>
                </div>
                <span className="whitespace-nowrap text-sm tabular-nums text-muted">{adminRegistrations.filter((r) => r.conferenceSlug === c.slug).length} reg.</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Recent registrations" className="mt-6" bodyClass="p-0" action={<Link to="/admin/registrations" className="text-sm font-semibold text-globe-700 hover:underline">View all</Link>}>
        <Table caption="Most recent registrations">
          <thead>
            <tr>
              <th className={th}>Reference</th>
              <th className={th}>Participant</th>
              <th className={th}>Conference</th>
              <th className={th}>Category</th>
              <th className={th}>Date</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {adminRegistrations.slice(0, 6).map((r) => (
              <tr key={r.ref}>
                <td className={`${td} font-semibold text-navy-900`}>{r.ref}</td>
                <td className={td}>
                  {r.name}
                  <span className="block text-xs text-muted">{r.country}</span>
                </td>
                <td className={td}>{sampleConferences.find((c) => c.slug === r.conferenceSlug)?.acronym}</td>
                <td className={td}>{r.category}</td>
                <td className={`${td} tabular-nums`}>{r.date}</td>
                <td className={td}>
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
      <p className="mt-6 flex items-center gap-2 text-sm text-muted">
        <FileClock aria-hidden className="size-4" /> All figures are development sample data.
      </p>
    </>
  );
}
