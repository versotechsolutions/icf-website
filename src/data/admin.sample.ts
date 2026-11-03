/**
 * DEVELOPMENT SAMPLE DATA FOR THE ADMIN UI — fictitious people and transactions.
 * Generated deterministically so screenshots are stable. Replace with API data in Phase 2.
 */
import { registrationFees } from './content';
import { sampleConferences } from './conferences.sample';

export type RegistrationStatus = 'Confirmed' | 'Awaiting payment' | 'Cancelled';
export type PaymentStatus = 'Successful' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'Online payment' | 'Bank transfer';

export interface AdminRegistration {
  ref: string;
  name: string;
  email: string;
  country: string;
  institution: string;
  conferenceSlug: string;
  category: string;
  period: 'Pre-enrolment' | 'Standard';
  amount: number;
  status: RegistrationStatus;
  date: string;
}

export interface AdminPayment {
  txn: string;
  regRef: string;
  name: string;
  amount: number;
  currency: 'USD';
  method: PaymentMethod;
  region: 'Indian' | 'International';
  status: PaymentStatus;
  date: string;
}

const first = ['Aarav', 'Meera', 'Kenji', 'Sofia', 'Daniel', 'Amara', 'Lucas', 'Priya', 'Yuki', 'Omar', 'Elena', 'Ravi', 'Hana', 'Tomás', 'Grace', 'Arjun', 'Lina', 'Samuel', 'Nadia', 'Wei', 'Fatima', 'Jonas', 'Ishita', 'Mateo'];
const last = ['Sharma', 'Iyer', 'Tanaka', 'Rossi', 'Okafor', 'Mensah', 'Silva', 'Nair', 'Sato', 'Haddad', 'Petrova', 'Kumar', 'Kim', 'García', 'Wilson', 'Menon', 'Hassan', 'Adeyemi', 'Rahman', 'Chen', 'Ali', 'Berg', 'Reddy', 'López'];
const countriesList = ['India', 'Japan', 'Italy', 'Nigeria', 'Ghana', 'Brazil', 'India', 'Japan', 'United Arab Emirates', 'Russia', 'India', 'South Korea', 'Spain', 'United Kingdom', 'India', 'Egypt', 'Nigeria', 'Bangladesh', 'China', 'Pakistan', 'Germany', 'India', 'Mexico', 'India'];
const institutions = ['University of Madras', 'Anna University', 'Kyoto University', 'University of Bologna', 'University of Lagos', 'University of Ghana', 'University of São Paulo', 'IIT Madras', 'Osaka University', 'Khalifa University', 'Moscow State University', 'VIT University', 'Yonsei University', 'University of Granada', 'University of Leeds', 'Amrita University', 'Cairo University', 'Covenant University', 'University of Dhaka', 'Tsinghua University', 'LUMS', 'TU Munich', 'SRM University', 'UNAM'];

const conferencesForRegs = sampleConferences.filter((c) => c.status === 'Published' || c.status === 'Completed').slice(0, 8);
const statuses: RegistrationStatus[] = ['Confirmed', 'Confirmed', 'Confirmed', 'Awaiting payment', 'Confirmed', 'Cancelled', 'Confirmed', 'Awaiting payment'];
const months = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-08', '2026-09', '2026-09', '2026-10', '2026-10', '2026-10'];

export const adminRegistrations: AdminRegistration[] = Array.from({ length: 48 }, (_, i) => {
  const fee = registrationFees[(i * 5) % registrationFees.length];
  const period: AdminRegistration['period'] = i % 3 === 0 ? 'Standard' : 'Pre-enrolment';
  const n = i % first.length;
  const name = `${first[n]} ${last[(n * 7 + i) % last.length]}`;
  return {
    ref: `ICF-R-${String(2401 + i)}`,
    name,
    email: `${first[n].toLowerCase()}.${last[(n * 7 + i) % last.length].toLowerCase().replace(/[^a-z]/g, '')}@example.edu`,
    country: countriesList[n],
    institution: institutions[n],
    conferenceSlug: conferencesForRegs[i % conferencesForRegs.length].slug,
    category: fee.category,
    period,
    amount: period === 'Standard' ? fee.standard : fee.preEnrolment,
    status: statuses[i % statuses.length],
    date: `${months[i % months.length]}-${String(((i * 3) % 27) + 1).padStart(2, '0')}`,
  };
}).sort((a, b) => b.date.localeCompare(a.date));

export const adminPayments: AdminPayment[] = adminRegistrations
  .filter((r) => r.status !== 'Cancelled' || r.ref.endsWith('5'))
  .map((r, i) => ({
    txn: `TXN${(904713 + i * 37).toString(36).toUpperCase()}`,
    regRef: r.ref,
    name: r.name,
    amount: r.amount,
    currency: 'USD' as const,
    method: (i % 4 === 1 ? 'Bank transfer' : 'Online payment') as PaymentMethod,
    region: (r.country === 'India' ? 'Indian' : 'International') as AdminPayment['region'],
    status: (r.status === 'Confirmed' ? 'Successful' : r.status === 'Cancelled' ? 'Refunded' : i % 5 === 0 ? 'Failed' : 'Pending') as PaymentStatus,
    date: r.date,
  }));

export interface EmailTemplate {
  id: string;
  name: string;
  trigger: string;
  subject: string;
  body: string;
  enabled: boolean;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'reg-confirmation',
    name: 'Registration confirmation',
    trigger: 'When a registration is submitted',
    subject: 'Your registration for {{conference_acronym}} is received',
    body: 'Dear {{participant_name}},\n\nThank you for registering for {{conference_title}} ({{conference_acronym}}). Your registration reference is {{registration_ref}}.\n\nPlease send the scanned copy of your registration fee receipt or transaction proof to support@internationalconferenceforum.com on or before the last date of registration.\n\nKind regards,\nICF Conference Coordination Team',
    enabled: true,
  },
  {
    id: 'payment-received',
    name: 'Payment confirmation',
    trigger: 'When a payment is marked successful',
    subject: 'Payment received for {{registration_ref}}',
    body: 'Dear {{participant_name}},\n\nWe have received your payment of {{amount}} for {{conference_acronym}}. Your registration is now confirmed.\n\nKind regards,\nICF Conference Coordination Team',
    enabled: true,
  },
  {
    id: 'event-reminder',
    name: 'Conference reminder',
    trigger: 'Seven days before the conference',
    subject: '{{conference_acronym}} starts on {{conference_date}}',
    body: 'Dear {{participant_name}},\n\nThis is a reminder that {{conference_title}} begins on {{conference_date}}. Joining details for online participants will follow by email.\n\nKind regards,\nICF Conference Coordination Team',
    enabled: true,
  },
  {
    id: 'enquiry-ack',
    name: 'Enquiry acknowledgement',
    trigger: 'When a contact form enquiry is received',
    subject: 'We have received your enquiry',
    body: 'Dear {{participant_name}},\n\nThank you for contacting the International Conference Forum (ICF). Our team will respond as soon as possible.\n\nKind regards,\nICF Team',
    enabled: false,
  },
];

export const emailLog = [
  { id: 1, template: 'Registration confirmation', to: adminRegistrations[0].email, date: '2026-11-02 10:14', status: 'Delivered' },
  { id: 2, template: 'Payment confirmation', to: adminRegistrations[1].email, date: '2026-11-02 09:41', status: 'Delivered' },
  { id: 3, template: 'Registration confirmation', to: adminRegistrations[2].email, date: '2026-11-01 17:03', status: 'Bounced' },
  { id: 4, template: 'Conference reminder', to: '27 participants (ICICGB-26)', date: '2026-11-01 08:00', status: 'Scheduled' },
  { id: 5, template: 'Payment confirmation', to: adminRegistrations[4].email, date: '2026-10-31 15:22', status: 'Delivered' },
];

export type AdminRole = 'Super admin' | 'Conference manager' | 'Viewer';
export const adminUsers = [
  { id: 'u1', name: 'ICF Administrator', email: 'admin@internationalconferenceforum.com', role: 'Super admin' as AdminRole, status: 'Active', lastActive: 'Today, 09:12' },
  { id: 'u2', name: 'Conference Coordinator', email: 'coordinator@example.com', role: 'Conference manager' as AdminRole, status: 'Active', lastActive: 'Yesterday, 18:40' },
  { id: 'u3', name: 'Finance Reviewer', email: 'finance@example.com', role: 'Viewer' as AdminRole, status: 'Invited', lastActive: 'Never' },
];

export const adminModules = ['Dashboard', 'Conferences', 'Registrations', 'Payments', 'Email notifications', 'Reports', 'Conference content', 'Admin access'] as const;

export const rolePermissions: Record<AdminRole, Record<(typeof adminModules)[number], 'Full' | 'Edit' | 'View' | 'None'>> = {
  'Super admin': { Dashboard: 'Full', Conferences: 'Full', Registrations: 'Full', Payments: 'Full', 'Email notifications': 'Full', Reports: 'Full', 'Conference content': 'Full', 'Admin access': 'Full' },
  'Conference manager': { Dashboard: 'View', Conferences: 'Edit', Registrations: 'Edit', Payments: 'View', 'Email notifications': 'Edit', Reports: 'View', 'Conference content': 'Edit', 'Admin access': 'None' },
  Viewer: { Dashboard: 'View', Conferences: 'View', Registrations: 'View', Payments: 'View', 'Email notifications': 'None', Reports: 'View', 'Conference content': 'None', 'Admin access': 'None' },
};
