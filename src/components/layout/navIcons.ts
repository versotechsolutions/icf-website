import {
  Award,
  Building2,
  CalendarClock,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  FileText,
  FileUp,
  LibraryBig,
  Mail,
  Megaphone,
  Plane,
  Video,
  type LucideIcon,
} from 'lucide-react';

/** Icon for each submenu destination, keyed by route. Shared by desktop dropdowns and the mobile menu. */
export const navIcons: Record<string, LucideIcon> = {
  '/conferences': CalendarDays,
  '/topics': LibraryBig,
  '/event/icicgb-26': FileText,
  '/registration': ClipboardCheck,
  '/paper-submission': FileUp,
  '/invitation-letter': Mail,
  '/awards': Award,
  '/call-for-papers': Megaphone,
  '/programme': CalendarClock,
  '/faq': CircleHelp,
  '/venue': Building2,
  '/travel': Plane,
  '/video-conferencing': Video,
};
