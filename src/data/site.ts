/**
 * Organisation-wide details.
 * Source: "Requirement- icf.docx" and the event-site Contact Us / Registration documents.
 * Values marked `pending` still need client confirmation (see docs/pending-client-items.md).
 */
import type { NavGroup, NavItem } from '@/types';

export const site = {
  name: 'International Conference Forum',
  shortName: 'ICF',
  // Tagline taken from the client-supplied homepage banner artwork.
  tagline: 'Connect, share, advance',
  heroLine: 'Bringing researchers, professionals and innovators together for a better tomorrow',
  domain: 'internationalconferenceforum.com',
  website: 'https://internationalconferenceforum.com',
  contact: {
    supportEmail: 'support@internationalconferenceforum.com',
    generalEmail: 'icfofficial5@gmail.com',
    phone: '+91 8220586724',
    phoneHref: 'tel:+918220586724',
    city: 'Chennai, India',
    /** Full postal address has not been supplied. */
    addressPending: true,
  },
  /** Facebook and LinkedIn are named in the brief, but no profile URLs were supplied. */
  social: [
    { name: 'Facebook', url: null as string | null },
    { name: 'LinkedIn', url: null as string | null },
  ],
  footerIntro:
    'International Conference Forum (ICF) provides a platform for researchers, academicians, scholars, and industry professionals to discover international conferences, share knowledge, and exchange innovative ideas across diverse fields.',
} as const;

export const mainNav: NavGroup[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Conferences',
    items: [
      { label: 'Upcoming conferences', to: '/conferences', description: 'Search by country, month, topic or keyword' },
      { label: 'Browse by topic', to: '/topics', description: 'Ten subject areas and their research themes' },
    ],
  },
  { label: 'Paper submission', to: '/paper-submission' },
  { label: 'Invitation letter', to: '/invitation-letter' },
  { label: 'Awards', to: '/awards' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

/** Right-hand "Quick Links" shown on every conference/event page (source: Quick Links.docx). */
export const eventQuickLinks: (NavItem & { action?: 'brochure' })[] = [
  { label: 'Call for papers', to: '/call-for-papers' },
  { label: 'Paper submission', to: '/paper-submission' },
  { label: 'Register now', to: '/registration' },
  { label: 'Tentative programme', to: '/programme' },
  { label: 'Invitation letter', to: '/invitation-letter' },
  { label: 'Awards', to: '/awards' },
  { label: 'Download brochure', to: '#brochure', action: 'brochure' },
];

/** Footer columns (source: Footer page.docx, with links mapped to built pages). */
export const footerNav = {
  quickLinks: [
    { label: 'About us', to: '/about' },
    { label: 'Upcoming conferences', to: '/conferences' },
    { label: 'Awards', to: '/awards' },
    { label: 'Terms & Conditions', to: '/policies/terms' },
    { label: 'Privacy Policy', to: '/policies/privacy' },
  ] satisfies NavItem[],
  legal: [
    { label: 'Privacy Policy', to: '/policies/privacy' },
    { label: 'Terms & Conditions', to: '/policies/terms' },
    { label: 'Disclaimer', to: '/policies/disclaimer' },
    { label: 'Refund & Cancellation Policy', to: '/policies/refund-cancellation' },
  ] satisfies NavItem[],
};
