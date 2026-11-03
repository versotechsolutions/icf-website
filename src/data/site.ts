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
      { label: 'Conference details', to: '/event/icicgb-26', description: 'Example conference page layout' },
    ],
  },
  {
    label: 'For participants',
    items: [
      { label: 'Registration', to: '/registration', description: 'Categories, fees and how to register' },
      { label: 'Paper submission', to: '/paper-submission', description: 'Abstract and full paper guidelines' },
      { label: 'Invitation letter', to: '/invitation-letter', description: 'Requirements and visa disclaimer' },
      { label: 'Awards', to: '/awards', description: 'Recognition for research and presentation' },
    ],
  },
  {
    label: 'Conference info',
    items: [
      { label: 'Call for papers', to: '/call-for-papers', description: 'Research themes by subject area' },
      { label: 'Programme', to: '/programme', description: 'Agenda and indicative schedule' },
      { label: 'Conference FAQ', to: '/faq', description: 'Answers to common questions' },
      { label: 'Tentative venue', to: '/venue', description: 'Venue details for each conference' },
      { label: 'Travel information', to: '/travel', description: 'Visa, travel and accommodation guidance' },
      { label: 'Video conferencing', to: '/video-conferencing', description: 'Joining and presenting online' },
    ],
  },
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
    { label: 'Home', to: '/' },
    { label: 'About us', to: '/about' },
    { label: 'Browse conferences', to: '/topics' },
    { label: 'Upcoming conferences', to: '/conferences' },
    { label: 'Submit a conference', to: '/contact?enquiry=partnership' },
  ] satisfies NavItem[],
  participants: [
    { label: 'Registration information', to: '/registration' },
    { label: 'Abstract submission', to: '/paper-submission#abstract' },
    { label: 'Paper submission', to: '/paper-submission#full-paper' },
    { label: 'Invitation letter', to: '/invitation-letter' },
    { label: 'FAQs', to: '/faq' },
  ] satisfies NavItem[],
  legal: [
    { label: 'Privacy Policy', to: '/policies/privacy' },
    { label: 'Terms & Conditions', to: '/policies/terms' },
    { label: 'Disclaimer', to: '/policies/disclaimer' },
    { label: 'Refund & Cancellation Policy', to: '/policies/refund-cancellation' },
  ] satisfies NavItem[],
};
