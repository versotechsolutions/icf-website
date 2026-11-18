import { CalendarDays, LibraryBig, type LucideIcon } from 'lucide-react';

/** Icon for each submenu destination, keyed by route. Shared by desktop dropdowns and the mobile menu. */
export const navIcons: Record<string, LucideIcon> = {
  '/conferences': CalendarDays,
  '/topics': LibraryBig,
};
