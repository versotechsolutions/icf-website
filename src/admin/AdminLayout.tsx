import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, CalendarRange, CreditCard, ExternalLink, FileEdit, LayoutDashboard, LogOut, Mail, Menu, ShieldCheck, Users, X } from 'lucide-react';
import { ToastProvider } from './components/Toast';
import { cn } from '@/utils/cn';

/** The eight modules in the approved Phase scope. */
export const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/conferences', label: 'Conferences', icon: CalendarRange },
  { to: '/admin/registrations', label: 'Registrations', icon: Users },
  { to: '/admin/payments', label: 'Payment status', icon: CreditCard },
  { to: '/admin/emails', label: 'Email notifications', icon: Mail },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/content', label: 'Conference content', icon: FileEdit },
  { to: '/admin/access', label: 'Admin access', icon: ShieldCheck },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-navy-950 text-white">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="rounded-[var(--radius-sm)] bg-white p-1.5">
          <img src="/images/icf-emblem.webp" alt="" className="h-7 w-auto" />
        </span>
        <span className="leading-tight">
          <span className="block font-serif text-[1.05rem] font-semibold">ICF Admin</span>
          <span className="block text-xs text-white/55">Conference management</span>
        </span>
      </Link>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {adminNav.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-[var(--radius-sm)] border-l-2 px-3 py-2.5 text-[0.93rem] font-semibold',
                    isActive ? 'border-gold-400 bg-white/10 text-white' : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <Icon aria-hidden className="size-[1.125rem]" strokeWidth={1.7} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3 text-sm">
        <Link to="/" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white">
          <ExternalLink aria-hidden className="size-4" /> View website
        </Link>
        <Link to="/admin/login" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white">
          <LogOut aria-hidden className="size-4" /> Sign out
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    document.title = 'ICF Admin (demo)';
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-[#f5f7fa] lg:grid lg:grid-cols-[16rem_1fr]">
        <aside className="hidden bg-navy-950 lg:block">
          <div className="sticky top-0 h-dvh">
            <Sidebar />
          </div>
        </aside>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
            <div className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
            <button onClick={() => setOpen(false)} className="absolute left-[18.5rem] top-4 rounded bg-white p-2" aria-label="Close navigation">
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-rule bg-white px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="rounded p-2 text-navy-900 hover:bg-mist lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </button>
              <span className="rounded-full border border-dashed border-gold-500/70 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-700">
                Demo mode: sample data, no changes are saved
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-right text-sm leading-tight sm:block">
                <span className="block font-semibold text-navy-900">ICF Administrator</span>
                <span className="block text-muted">Super admin</span>
              </span>
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-gold-300" aria-hidden>
                IA
              </span>
            </div>
          </header>
          <main id="main" className="px-4 py-8 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
