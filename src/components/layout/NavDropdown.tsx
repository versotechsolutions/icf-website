import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { navIcons } from './navIcons';
import { cn } from '@/utils/cn';
import type { NavGroup, NavItem } from '@/types';

/* -------------------------------------------------------------------------------------------------
 * Desktop navigation dropdown (disclosure pattern: button + list of links).
 *
 * Open state is owned by the parent (<DesktopNav>), so only one dropdown is open at a time.
 * - Mouse: opens on hover, closes after a short grace period (no flicker crossing the gap),
 *   click keeps it open.
 * - Touch (large tablets in landscape that show the desktop nav): tap toggles.
 * - Keyboard: Enter/Space toggles, ArrowDown opens and focuses the first link, arrows/Home/End
 *   move between links, Escape closes and returns focus, tabbing out closes.
 * ---------------------------------------------------------------------------------------------- */

type Props = {
  group: NavGroup;
  open: boolean;
  active: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  /** Hover intent: parent schedules / cancels the delayed close. */
  onPointerLeave: () => void;
  onPointerEnter: () => void;
};

export const menuIdFor = (label: string) => `menu-${label.replace(/\s+/g, '-').toLowerCase()}`;

export function NavDropdown({ group, open, active, onOpen, onClose, onToggle, onPointerEnter, onPointerLeave }: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef<string>('mouse');
  const openedByHover = useRef(false);
  const menuId = menuIdFor(group.label);

  // Keyboard "ArrowDown" opens the menu, then focuses the first link once it is rendered (no longer inert).
  const focusFirstOnOpen = useRef(false);
  useEffect(() => {
    if (open && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      focusLink(0);
    }
  });

  const links = () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []);
  const focusLink = (index: number) => {
    const l = links();
    if (!l.length) return;
    l[(index + l.length) % l.length].focus();
  };

  const handleEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    onPointerEnter();
    if (!open) {
      openedByHover.current = true;
      onOpen();
    }
  };
  const handleLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    openedByHover.current = false;
    onPointerLeave();
  };

  const onTriggerClick = (e: React.MouseEvent) => {
    // detail === 0 → activated from the keyboard
    if (e.detail === 0 || pointerType.current !== 'mouse') return onToggle();
    // Mouse: hover has already opened it (possibly not yet rendered), so the click confirms rather than closes.
    if (openedByHover.current) {
      openedByHover.current = false;
      return onOpen();
    }
    onToggle();
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (open) focusLink(0);
      else {
        focusFirstOnOpen.current = true;
        onOpen();
      }
    } else if (e.key === 'Escape' && open) {
      onClose();
    }
  };

  const onPanelKey = (e: KeyboardEvent) => {
    const l = links();
    const i = l.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusLink(i + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (i <= 0) triggerRef.current?.focus();
      else focusLink(i - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusLink(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusLink(l.length - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      triggerRef.current?.focus();
    }
  };

  return (
    <li
      className="relative"
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKey}
        className={cn(
          'relative inline-flex h-full items-center gap-1 whitespace-nowrap px-2.5 text-[0.95rem] font-semibold transition-colors',
          open || active ? 'text-navy-900' : 'text-ink/80 hover:text-navy-900',
        )}
      >
        {group.label}
        <ChevronDown aria-hidden className={cn('size-4 text-gold-500 transition-transform duration-200', open && 'rotate-180')} />
        {/* Underline: gold when the section is current, appears while the menu is open */}
        <span
          aria-hidden
          className={cn(
            'absolute inset-x-2.5 -bottom-px h-0.5 origin-center bg-gold-500 transition-transform duration-200',
            active || open ? 'scale-x-100' : 'scale-x-0',
          )}
        />
      </button>

      <DropdownPanel id={menuId} open={open} panelRef={panelRef} onKeyDown={onPanelKey}>
        {group.items!.map((item, i) => (
          <DropdownLink key={item.to} item={item} index={i} onNavigate={onClose} />
        ))}
      </DropdownPanel>
    </li>
  );
}

/** The floating panel: white card whose gold top rule draws out from the centre as it lands. */
export function DropdownPanel({
  id,
  open,
  panelRef,
  onKeyDown,
  children,
}: {
  id: string;
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onKeyDown: (e: KeyboardEvent) => void;
  children: React.ReactNode;
}) {
  return (
    // pt-3 is an invisible hover bridge between the trigger and the card.
    <div
      id={id}
      ref={panelRef}
      onKeyDown={onKeyDown}
      inert={!open}
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'absolute left-0 top-full z-50 pt-3 ease-out',
        // Opening: visibility flips immediately (so links are focusable at once) while opacity/position animate.
        // Closing: visibility waits for the fade-out to finish.
        open
          ? 'visible opacity-100'
          : 'invisible -translate-y-1 opacity-0 transition-[opacity,transform,visibility] duration-150',
      )}
    >
      <div className="dd-card relative w-[23rem] rounded-[var(--radius-lg)] border border-rule bg-white shadow-[0_1px_2px_rgb(14_35_71/0.06),0_18px_40px_-16px_rgb(8_22_48/0.35)]">
        {/* Gold top rule: grows from the centre out to both sides as the panel lands */}
        <span aria-hidden className="dd-rule absolute inset-x-0 top-0 h-[3px] rounded-t-[var(--radius-lg)] bg-gold-500" />
        <ul className="relative space-y-0.5 p-2 pt-3">{children}</ul>
      </div>
    </div>
  );
}

/** One destination in a dropdown: icon tile, label, one-line description; current page marked. */
export function DropdownLink({ item, index = 0, onNavigate }: { item: NavItem; index?: number; onNavigate: () => void }) {
  const Icon = navIcons[item.to.split('?')[0]];
  return (
    <li className="dd-item" style={{ '--i': index } as React.CSSProperties}>
      <NavLink
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group/link relative flex items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 outline-offset-[-2px] transition-colors',
            'hover:bg-mist focus-visible:bg-mist',
            isActive && 'bg-mist',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r bg-gold-500" />}
            {Icon && (
              <span
                className={cn(
                  'mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors',
                  isActive
                    ? 'bg-navy-900 text-gold-300'
                    : 'bg-navy-50 text-navy-800 group-hover/link:bg-navy-900 group-hover/link:text-gold-300 group-focus-visible/link:bg-navy-900 group-focus-visible/link:text-gold-300',
                )}
              >
                <Icon aria-hidden className="size-[1.125rem]" strokeWidth={1.7} />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className={cn('block font-semibold leading-snug transition-colors', isActive ? 'text-navy-900' : 'text-navy-900 group-hover/link:text-globe-700')}>
                {item.label}
                {isActive && <span className="sr-only"> (current page)</span>}
              </span>
              {item.description && <span className="mt-0.5 block text-[0.84rem] leading-snug text-muted">{item.description}</span>}
            </span>
            <ChevronRight
              aria-hidden
              className="mt-2.5 size-4 shrink-0 -translate-x-1 text-gold-500 opacity-0 transition-all duration-150 group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100"
            />
          </>
        )}
      </NavLink>
    </li>
  );
}
