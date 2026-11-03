import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { email, required } from '@/utils/validation';
import { TextField, CheckboxField } from '@/components/forms/Fields';
import { Button } from '@/components/ui/Button';
import { OrbitLines } from '@/components/ui/OrbitLines';

/** Admin sign-in screen (UI only). Production authentication is out of Phase 1 scope. */
export default function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  useEffect(() => {
    document.title = 'Sign in | ICF Admin';
  }, []);
  const form = useForm(
    { email: '', password: '', remember: 'false' },
    { email: [required('your email address'), email], password: [required('your password')], remember: [] },
  );

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <OrbitLines animate className="absolute inset-0 h-full w-full" />
        <span className="relative inline-flex w-fit rounded-[var(--radius-md)] bg-white px-3 py-2">
          <img src="/images/icf-logo.webp" alt="International Conference Forum (ICF)" className="h-16 w-auto" />
        </span>
        <div className="relative max-w-md">
          <h1 className="text-h1 text-white">Conference administration</h1>
          <p className="mt-4 text-lg text-white/75">Manage conferences, registrations, payment status, notifications and conference page content.</p>
        </div>
        <p className="relative text-sm text-white/50">International Conference Forum (ICF)</p>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <img src="/images/icf-emblem.webp" alt="" className="h-12 w-auto lg:hidden" />
          <h2 className="mt-6 text-h2 lg:mt-0">Sign in</h2>
          <p className="mt-2 text-muted">Use your ICF administrator account.</p>
          <p className="mt-4 rounded-[var(--radius-md)] border border-dashed border-gold-500/60 bg-gold-50 px-3 py-2 text-sm text-gold-700">
            Demo: any valid email and password opens the dashboard. No real authentication is performed.
          </p>
          <form noValidate onSubmit={form.handleSubmit(() => navigate('/admin'))} className="mt-6 space-y-5">
            <TextField label="Email address" required type="email" autoComplete="username" {...form.field('email')} />
            <div className="relative">
              <TextField label="Password" required type={show ? 'text' : 'password'} autoComplete="current-password" {...form.field('password')} />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-[2.1rem] rounded p-1.5 text-muted hover:text-navy-900" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <CheckboxField id="f-remember" name="remember" label="Keep me signed in" checked={form.values.remember === 'true'} onChange={form.field('remember').onChange} />
              <span className="text-sm text-muted">Forgot password?</span>
            </div>
            <Button type="submit" size="lg" className="w-full">
              <LockKeyhole aria-hidden className="size-4" />
              Sign in
            </Button>
          </form>
          <Link to="/" className="mt-8 inline-block text-sm font-semibold text-globe-700 hover:underline">
            Back to the website
          </Link>
        </div>
      </div>
    </div>
  );
}
