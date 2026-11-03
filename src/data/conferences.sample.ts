/**
 * DEVELOPMENT SAMPLE DATA — NOT REAL ICF CONFERENCES.
 *
 * The client brief requires conference results to come from ICF's database. That integration
 * is out of scope for Phase 1, so these records exist only to demonstrate the listing,
 * filters, pagination and detail layouts. Every record carries `isSample: true` and the UI
 * labels them as sample listings.
 *
 * Titles are built from the client's Call for Papers subject list. ICICGB-26 is the example
 * conference named in "About Conf page.docx"; its date and city here are placeholders
 * (the Nagoya venue is the example given in "Tentative venue page.docx").
 */
import type { Conference, ConferenceMode, ConferenceStatus } from '@/types';

type Row = [
  slug: string,
  acronym: string,
  title: string,
  topicSlug: string,
  countryCode: string,
  city: string,
  start: string,
  days: number,
  mode: ConferenceMode,
  status?: ConferenceStatus,
  featured?: boolean,
];

const rows: Row[] = [
  ['icicgb-26', 'ICICGB-26', 'International Conference on Innovation and Competition in Global Banking', 'business-and-economics', 'JP', 'Nagoya', '2026-12-14', 2, 'Hybrid', 'Published', true],
  ['icetel-27', 'ICETEL-27', 'International Conference on Educational Technology and E-Learning', 'education', 'IN', 'Chennai', '2027-01-18', 2, 'Hybrid', 'Published', true],
  ['icaiml-27', 'ICAIML-27', 'International Conference on Artificial Intelligence and Machine Learning', 'engineering-and-technology', 'SG', 'Singapore', '2027-01-25', 2, 'In person', 'Published', true],
  ['icphcm-27', 'ICPHCM-27', 'International Conference on Public Health and Community Medicine', 'health-and-medicine', 'AE', 'Dubai', '2027-02-08', 2, 'Hybrid'],
  ['icsdgc-27', 'ICSDGC-27', 'International Conference on Sustainable Development and Global Challenges', 'interdisciplinary', 'GB', 'London', '2027-02-22', 2, 'In person'],
  ['iccltj-27', 'ICCLTJ-27', 'International Conference on Cyber Law and Information Technology Law', 'law', 'MY', 'Kuala Lumpur', '2027-03-04', 2, 'Hybrid'],
  ['icasm-27', 'ICASM-27', 'International Conference on Applied Statistics and Statistical Modelling', 'mathematics-and-statistics', 'DE', 'Berlin', '2027-03-15', 2, 'In person'],
  ['icmse-27', 'ICMSE-27', 'International Conference on Materials Science and Engineering', 'physical-and-life-sciences', 'JP', 'Tokyo', '2027-03-29', 2, 'In person'],
  ['icsas-27', 'ICSAS-27', 'International Conference on South Asian Studies', 'regional-studies', 'LK', 'Colombo', '2027-04-05', 2, 'Hybrid'],
  ['icirga-27', 'ICIRGA-27', 'International Conference on International Relations and Global Affairs', 'social-sciences-and-humanities', 'FR', 'Paris', '2027-04-19', 2, 'In person'],
  ['icftdf-27', 'ICFTDF-27', 'International Conference on FinTech and Digital Finance', 'business-and-economics', 'AE', 'Abu Dhabi', '2027-04-26', 2, 'Hybrid'],
  ['icdhtm-27', 'ICDHTM-27', 'International Conference on Digital Health and Telemedicine', 'health-and-medicine', 'CA', 'Toronto', '2027-05-10', 2, 'Hybrid'],
  ['iccsis-27', 'ICCSIS-27', 'International Conference on Cybersecurity and Information Security', 'engineering-and-technology', 'US', 'New York', '2027-05-17', 2, 'In person'],
  ['ichetl-27', 'ICHETL-27', 'International Conference on Higher Education and University Studies', 'education', 'AU', 'Melbourne', '2027-05-24', 2, 'Hybrid'],
  ['iccecj-27', 'ICCECJ-27', 'International Conference on Environmental Law and Climate Justice', 'law', 'NL', 'Amsterdam', '2027-06-07', 2, 'In person'],
  ['icbsmr-27', 'ICBSMR-27', 'International Conference on Biomedical Sciences and Medical Research', 'health-and-medicine', 'TH', 'Bangkok', '2027-06-14', 2, 'In person'],
  ['icscm-27', 'ICSCM-27', 'International Conference on Supply Chain and Logistics Management', 'business-and-economics', 'IN', 'Bengaluru', '2027-06-21', 2, 'Hybrid'],
  ['icqps-27', 'ICQPS-27', 'International Conference on Quantum Physics and Quantum Science', 'physical-and-life-sciences', 'CH', 'Zurich', '2027-07-05', 2, 'In person'],
  ['icas-27', 'ICAS-27', 'International Conference on African Studies', 'regional-studies', 'ZA', 'Cape Town', '2027-07-12', 2, 'Hybrid'],
  ['iciot-27', 'ICIOT-27', 'International Conference on Internet of Things', 'engineering-and-technology', 'KR', 'Seoul', '2027-07-19', 2, 'In person'],
  ['icdsi-27', 'ICDSI-27', 'International Conference on Data Science for Social Impact', 'interdisciplinary', 'BR', 'São Paulo', '2027-08-02', 2, 'Online'],
  ['icmslc-27', 'ICMSLC-27', 'International Conference on Media Studies and Mass Communication', 'social-sciences-and-humanities', 'IN', 'New Delhi', '2027-08-16', 2, 'Hybrid'],
  ['icbayes-27', 'ICBAYES-27', 'International Conference on Bayesian Statistics', 'mathematics-and-statistics', 'NZ', 'Auckland', '2027-08-23', 2, 'Online'],
  ['icpmh-27', 'ICPMH-27', 'International Conference on Psychiatry and Mental Health', 'health-and-medicine', 'GB', 'Edinburgh', '2027-09-06', 2, 'In person'],
  ['iceds-27', 'ICEDS-27', 'International Conference on Educational Psychology and Student Learning', 'education', 'US', 'Boston', '2027-09-13', 2, 'Hybrid', 'Draft'],
  ['iclas-27', 'ICLAS-27', 'International Conference on Latin American and Caribbean Studies', 'regional-studies', 'MX', 'Mexico City', '2027-09-27', 2, 'Hybrid', 'Pending'],
  ['icbcm-26', 'ICBCM-26', 'International Conference on Business Administration and Management', 'business-and-economics', 'IN', 'Chennai', '2026-09-21', 2, 'Hybrid', 'Completed'],
];

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days - 1);
  return d.toISOString().slice(0, 10);
};

export const sampleConferences: Conference[] = rows.map(
  ([slug, acronym, title, topicSlug, countryCode, city, start, days, mode, status = 'Published', featured = false], i) => ({
    id: `sample-${String(i + 1).padStart(3, '0')}`,
    slug,
    acronym,
    title,
    topicSlug,
    countryCode,
    city,
    startDate: start,
    endDate: addDays(start, days),
    mode,
    status,
    featured,
    isSample: true,
  }),
);
