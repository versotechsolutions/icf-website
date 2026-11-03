import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { footerNav, site } from '@/data/site';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

function Column({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h2 className="font-serif text-lg font-semibold text-white">{title}</h2>
      <span className="rule-gold mt-3 !w-8" aria-hidden />
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-white/75 hover:text-white hover:underline hover:decoration-gold-400 hover:underline-offset-4">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-[0.95rem] text-white/80">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo plate className="h-20" />
          <p className="mt-6 max-w-sm leading-relaxed text-white/75">{site.footerIntro}</p>
        </div>
        <Column title="Quick links" links={footerNav.quickLinks} />
        <Column title="For participants" links={footerNav.participants} />
        <div>
          <h2 className="font-serif text-lg font-semibold text-white">Contact us</h2>
          <span className="rule-gold mt-3 !w-8" aria-hidden />
          <ul className="mt-5 space-y-3.5">
            <li className="flex gap-3">
              <Mail aria-hidden className="mt-1 size-4 shrink-0 text-gold-400" />
              <span>
                <a href={`mailto:${site.contact.supportEmail}`} className="text-white hover:underline">
                  support@
                  <wbr />
                  {site.domain}
                </a>
                <span className="block text-sm text-white/60">Participant support</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden className="mt-1 size-4 shrink-0 text-gold-400" />
              <span>
                <a href={`mailto:${site.contact.generalEmail}`} className="text-white hover:underline">
                  {site.contact.generalEmail}
                </a>
                <span className="block text-sm text-white/60">General enquiries</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone aria-hidden className="mt-1 size-4 shrink-0 text-gold-400" />
              <a href={site.contact.phoneHref} className="text-white hover:underline">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Globe aria-hidden className="mt-1 size-4 shrink-0 text-gold-400" />
              <span className="text-white">{site.domain}</span>
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-gold-400" />
              <span className="text-white">{site.contact.city}</span>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {site.name} ({site.shortName}). All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/admin/login" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
