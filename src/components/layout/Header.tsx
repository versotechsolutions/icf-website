import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { mainNav, site } from '@/data/site';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { NavGroup } from '@/types';

function UtilityBar() {
  return (
    <div className="bg-navy-950 text-[0.82rem] text-white/80">
      <Container className="flex h-9 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <a href={`mailto:${site.contact.supportEmail}`} className="inline-flex items-center gap-1.5 hover:text-white">
            <Mail aria-hidden className="size-3.5 text-gold-400" />
            <span className="hidden sm:inline">{site.contact.supportEmail}</span>
            <span className="sm:hidden">Email us</span>
          </a>
          <a href={site.contact.phoneHref} className="inline-flex items-center gap-1.5 hover:text-white">
            <Phone aria-hidden className="size-3.5 text-gold-400" />
            {site.contact.phone}
          </a>
        </div>
        <span className="hidden items-center gap-1.5 md:inline-flex">
          <MapPin aria-hidden className="size-3.5 text-gold-400" />
          {site.contact.city}
        </span>
      </Container>
    </div>
  );
}

function isGroupActive(group: NavGroup, pathname: string) {
  if (group.to) return group.to === '/' ? pathname === '/' : pathname.startsWith(group.to);
  return group.items?.some((i) => pathname.startsWith(i.to.split('?')[0])) ?? false;
}

function DesktopDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  useOnClickOutside(ref, () => setOpen(false), open);
  const active = isGroupActive(group, pathname);
  const menuId = `menu-${group.label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        aria-expanded={open}
        aria-controls={menuId}
        // Mouse: hover already opened the menu, so a click keeps it open.
        // Keyboard (detail === 0): Enter/Space toggles.
        onClick={(e) => (e.detail === 0 ? setOpen((o) => !o) : setOpen(true))}
        className={cn(
          'relative inline-flex h-full items-center gap-1 whitespace-nowrap px-2.5 text-[0.95rem] font-semibold',
          active ? 'text-navy-900' : 'text-ink/80 hover:text-navy-900',
        )}
      >
        {group.label}
        <ChevronDown aria-hidden className={cn('size-4 text-gold-500 transition-transform', open && 'rotate-180')} />
        {active && <span className="absolute inset-x-2.5 -bottom-px h-0.5 bg-gold-500" aria-hidden />}
      </button>
      <div id={menuId} hidden={!open} className="absolute left-0 top-full z-50 pt-2">
        <ul className="w-80 rounded-[var(--radius-md)] border border-rule bg-white p-2 shadow-[var(--shadow-panel)]">
          {group.items!.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn('block rounded-[var(--radius-sm)] px-3 py-2.5 hover:bg-mist', isActive && 'bg-mist')
                }
              >
                <span className="block font-semibold text-navy-900">{item.label}</span>
                {item.description && <span className="mt-0.5 block text-sm text-muted">{item.description}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      id="mobile-menu"
      hidden={!open}
      className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-rule bg-white xl:hidden"
    >
      <nav aria-label="Main" className="px-5 pb-10 pt-2 sm:px-8">
        <ul className="divide-y divide-rule">
          {mainNav.map((g) =>
            g.items ? (
              <li key={g.label}>
                <button
                  aria-expanded={expanded === g.label}
                  onClick={() => setExpanded((e) => (e === g.label ? null : g.label))}
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-navy-900"
                >
                  {g.label}
                  <ChevronDown aria-hidden className={cn('size-5 text-gold-500 transition-transform', expanded === g.label && 'rotate-180')} />
                </button>
                <ul hidden={expanded !== g.label} className="mb-3 space-y-1 border-l-2 border-gold-500 pl-4">
                  {g.items.map((i) => (
                    <li key={i.to}>
                      <NavLink to={i.to} onClick={onClose} className="block py-2 text-[1.02rem] text-ink/85">
                        {i.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={g.label}>
                <NavLink to={g.to!} onClick={onClose} className="block py-4 text-lg font-semibold text-navy-900">
                  {g.label}
                </NavLink>
              </li>
            ),
          )}
        </ul>
        <ButtonLink to="/registration" onClick={onClose} size="lg" className="mt-6 w-full">
          Register for a conference
        </ButtonLink>
      </nav>
    </div>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-semibold">
        Skip to main content
      </a>
      <UtilityBar />
      <header className={cn('sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow', scrolled ? 'border-rule shadow-[var(--shadow-lift)]' : 'border-transparent')}>
        <Container className="flex h-[4.5rem] items-stretch justify-between gap-6">
          <div className="flex items-center py-2.5">
            <Logo variant="lockup" />
          </div>
          <nav aria-label="Main" className="hidden xl:flex">
            <ul className="flex items-stretch">
              {mainNav.map((g) =>
                g.items ? (
                  <DesktopDropdown key={g.label} group={g} pathname={pathname} />
                ) : (
                  <li key={g.label} className="relative">
                    <NavLink
                      to={g.to!}
                      end={g.to === '/'}
                      className={({ isActive }) =>
                        cn('relative inline-flex h-full items-center whitespace-nowrap px-2.5 text-[0.95rem] font-semibold', isActive ? 'text-navy-900' : 'text-ink/80 hover:text-navy-900')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {g.label}
                          {isActive && <span className="absolute inset-x-2.5 -bottom-px h-0.5 bg-gold-500" aria-hidden />}
                        </>
                      )}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <ButtonLink to="/registration" size="sm" className="hidden sm:inline-flex">
              Register
            </ButtonLink>
            <button
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-navy-900 hover:bg-mist xl:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </Container>
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>
    </>
  );
}
