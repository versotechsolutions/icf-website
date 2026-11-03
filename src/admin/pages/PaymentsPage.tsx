import { useMemo, useState } from 'react';
import { BadgeCheck, CircleDollarSign, Clock3, XCircle } from 'lucide-react';
import { adminPayments, type AdminPayment } from '@/data/admin.sample';
import { formatUsd } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader, Panel, SegmentedFilter, StatCard, StatusBadge, Table, td, th } from '../components/AdminUI';
import { useToast } from '../components/Toast';

const filters = ['All', 'Successful', 'Pending', 'Failed', 'Refunded'] as const;
const regions = ['All regions', 'Indian', 'International'] as const;

/** Payment status tracking. Payment gateway integration and verification logic are Phase 2. */
export default function PaymentsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<AdminPayment[]>(adminPayments);
  const [f, setF] = useState<(typeof filters)[number]>('All');
  const [region, setRegion] = useState<(typeof regions)[number]>('All regions');

  const list = useMemo(() => rows.filter((p) => (f === 'All' || p.status === f) && (region === 'All regions' || p.region === region)), [rows, f, region]);
  const count = (s: string) => rows.filter((p) => p.status === s).length;

  return (
    <>
      <AdminPageHeader title="Payment status" intro="Track successful, pending and failed transactions with their registration references." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Successful" value={count('Successful')} icon={BadgeCheck} />
        <StatCard label="Pending" value={count('Pending')} note="Bank transfers need verification" icon={Clock3} />
        <StatCard label="Failed" value={count('Failed')} icon={XCircle} />
        <StatCard label="Refunded" value={count('Refunded')} icon={CircleDollarSign} />
      </div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:justify-between">
        <SegmentedFilter label="Filter by payment status" options={filters} value={f} onChange={setF} />
        <SegmentedFilter label="Filter by region" options={regions} value={region} onChange={setRegion} />
      </div>
      <Panel bodyClass="p-0">
        <Table caption="Payments">
          <thead>
            <tr>
              <th className={th}>Transaction ID</th>
              <th className={th}>Registration</th>
              <th className={th}>Participant</th>
              <th className={th}>Method</th>
              <th className={`${th} text-right`}>Amount</th>
              <th className={th}>Date</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.txn} className="hover:bg-mist/60">
                <td className={`${td} font-mono text-[0.85rem] text-navy-900`}>{p.txn}</td>
                <td className={td}>{p.regRef}</td>
                <td className={td}>
                  {p.name}
                  <span className="block text-xs text-muted">{p.region}</span>
                </td>
                <td className={td}>{p.method}</td>
                <td className={`${td} text-right tabular-nums`}>{formatUsd(p.amount)}</td>
                <td className={`${td} tabular-nums`}>{p.date}</td>
                <td className={td}><StatusBadge status={p.status} /></td>
                <td className={`${td} text-right`}>
                  {p.status === 'Pending' && p.method === 'Bank transfer' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setRows((r) => r.map((x) => (x.txn === p.txn ? { ...x, status: 'Successful' } : x)));
                        toast(`${p.txn} marked as received (demo only).`);
                      }}
                    >
                      Mark received
                    </Button>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
      <p className="mt-3 text-sm text-muted">{list.length} transactions (sample data). Payment verification against a gateway is part of a later phase.</p>
    </>
  );
}
