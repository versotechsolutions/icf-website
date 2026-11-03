import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { mainNav, site } from '@/data/site';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { NavDropdown } from './NavDropdown';
import { navIcons } from './navIcons';
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

/** Desktop navigation. Owns which dropdown is open so only one can be open at a time. */
function DesktopNav({ pathname }: { pathname: string }) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const close = useCallback(() => {
    cancelClose();
    setOpenLabel(null);
  }, []);
  // Hover intent: wait briefly before closing so moving diagonally into the panel never flickers.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenLabel(null), 180);
  };

  useOnClickOutside(navRef, close, openLabel !== null);
  useEffect(close, [pathname, close]);
  useEffect(() => cancelClose, []);

  return (
    <nav ref={navRef} aria-label="Main" className="hidden xl:flex">
      <ul className="flex items-stretch">
        {mainNav.map((g) =>
          g.items ? (
            <NavDropdown
              key={g.label}
              group={g}
              open={openLabel === g.label}
              active={isGroupActive(g, pathname)}
              onOpen={() => {
                cancelClose();
                setOpenLabel(g.label);
              }}
              onClose={close}
              onToggle={() => {
                cancelClose();
                setOpenLabel((o) => (o === g.label ? null : g.label));
              }}
              onPointerEnter={cancelClose}
              onPointerLeave={scheduleClose}
            />
          ) : (
            <li key={g.label} className="relative" onPointerEnter={(e) => e.pointerType === 'mouse' && openLabel && scheduleClose()}>
              <NavLink
                to={g.to!}
                end={g.to === '/'}
                onFocus={close}
                className={({ isActive }) =>
                  cn('relative inline-flex h-full items-center whitespace-nowrap px-2.5 text-[0.95rem] font-semibold transition-colors', isActive ? 'text-navy-900' : 'text-ink/80 hover:text-navy-900')
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
                  aria-controls={`m-${g.label.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setExpanded((e) => (e === g.label ? null : g.label))}
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-navy-900"
                >
                  {g.label}
                  <ChevronDown aria-hidden className={cn('size-5 text-gold-500 transition-transform duration-200', expanded === g.label && 'rotate-180')} />
                </button>
                {/* grid-rows 0fr → 1fr gives a smooth height transition without measuring */}
                <div
                  id={`m-${g.label.replace(/\s+/g, '-').toLowerCase()}`}
                  inert={expanded !== g.label}
                  className={cn('grid transition-[grid-template-rows,opacity] duration-200 ease-out', expanded === g.label ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
                >
                  <ul className="overflow-hidden">
                    <li className="h-1" aria-hidden />
                    {g.items.map((i) => {
                      const Icon = navIcons[i.to.split('?')[0]];
                      return (
                        <li key={i.to}>
                          <NavLink
                            to={i.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn('relative flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2.5 text-[1.02rem] transition-colors active:bg-mist', isActive ? 'bg-mist font-semibold text-navy-900' : 'text-ink/85')
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && <span aria-hidden className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-gold-500" />}
                                {Icon && (
                                  <span className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)]', isActive ? 'bg-navy-900 text-gold-300' : 'bg-navy-50 text-navy-800')}>
                                    <Icon aria-hidden className="size-4" strokeWidth={1.7} />
                                  </span>
                                )}
                                {i.label}
                                {isActive && <span className="sr-only"> (current page)</span>}
                              </>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                    <li className="h-3" aria-hidden />
                  </ul>
                </div>
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
          <DesktopNav pathname={pathname} />
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
