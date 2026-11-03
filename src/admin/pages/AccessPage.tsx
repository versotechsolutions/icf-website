import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { adminModules, adminUsers, rolePermissions, type AdminRole } from '@/data/admin.sample';
import { useForm } from '@/hooks/useForm';
import { email, required, selectRequired } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SelectField, TextField } from '@/components/forms/Fields';
import { AdminPageHeader, Panel, StatusBadge, Table, td, th } from '../components/AdminUI';
import { useToast } from '../components/Toast';
import { cn } from '@/utils/cn';

const roles = Object.keys(rolePermissions) as AdminRole[];
const levelCls = { Full: 'bg-navy-900 text-white', Edit: 'bg-globe-100 text-globe-700', View: 'bg-mist text-navy-800', None: 'text-muted' };

export default function AccessPage() {
  const toast = useToast();
  const [users, setUsers] = useState(adminUsers);
  const [invite, setInvite] = useState(false);
  const form = useForm({ name: '', email: '', role: '' }, { name: [required('a name')], email: [required('an email address'), email], role: [selectRequired('a role')] });

  return (
    <>
      <AdminPageHeader
        title="Admin access"
        intro="Control who can sign in to the admin dashboard and what each role can do."
        actions={<Button onClick={() => setInvite(true)}><UserPlus aria-hidden className="size-4" /> Invite admin user</Button>}
      />
      <Panel title="Admin users" bodyClass="p-0">
        <Table caption="Admin users">
          <thead>
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Role</th>
              <th className={th}>Status</th>
              <th className={th}>Last active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className={td}>
                  <span className="font-semibold text-navy-900">{u.name}</span>
                  <span className="block text-xs text-muted">{u.email}</span>
                </td>
                <td className={td}>
                  <label htmlFor={`role-${u.id}`} className="sr-only">Role for {u.name}</label>
                  <select
                    id={`role-${u.id}`}
                    className="field-input w-auto py-1.5 text-sm"
                    value={u.role}
                    disabled={u.role === 'Super admin'}
                    onChange={(e) => {
                      setUsers((us) => us.map((x) => (x.id === u.id ? { ...x, role: e.target.value as AdminRole } : x)));
                      toast(`${u.name} is now ${e.target.value} (demo only).`);
                    }}
                  >
                    {roles.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className={td}><StatusBadge status={u.status} /></td>
                <td className={td}>{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <Panel title="Role permissions" className="mt-6" bodyClass="p-0">
        <Table caption="Permissions for each role by module">
          <thead>
            <tr>
              <th className={th}>Module</th>
              {roles.map((r) => <th key={r} className={th}>{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {adminModules.map((m) => (
              <tr key={m}>
                <td className={`${td} font-semibold text-navy-900`}>{m}</td>
                {roles.map((r) => {
                  const lvl = rolePermissions[r][m];
                  return (
                    <td key={r} className={td}>
                      <span className={cn('inline-block rounded px-2 py-0.5 text-xs font-semibold', levelCls[lvl])}>{lvl === 'None' ? 'No access' : lvl}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <Modal open={invite} onClose={() => setInvite(false)} title="Invite admin user">
        <form
          noValidate
          className="grid gap-4"
          onSubmit={form.handleSubmit((v) => {
            setUsers((us) => [...us, { id: `u${us.length + 1}`, name: v.name, email: v.email, role: v.role as AdminRole, status: 'Invited', lastActive: 'Never' }]);
            toast(`Invitation for ${v.email} added (no email sent in demo).`);
            form.reset();
            setInvite(false);
          })}
        >
          <TextField label="Full name" required {...form.field('name')} />
          <TextField label="Email address" required type="email" {...form.field('email')} />
          <SelectField label="Role" required placeholder="Choose a role" options={roles} {...form.field('role')} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setInvite(false)}>Cancel</Button>
            <Button type="submit">Send invitation</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
