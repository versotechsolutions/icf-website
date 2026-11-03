export type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania';

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  slug: string;
  continent: Continent;
}

export interface Topic {
  slug: string;
  name: string;
  subtopics: string[];
}

export type ConferenceMode = 'In person' | 'Hybrid' | 'Online';
export type ConferenceStatus = 'Published' | 'Draft' | 'Pending' | 'Completed';

export interface Conference {
  id: string;
  slug: string;
  title: string;
  acronym: string;
  topicSlug: string;
  countryCode: string;
  city: string;
  /** ISO date (yyyy-mm-dd). Sample data only. */
  startDate: string;
  endDate: string;
  mode: ConferenceMode;
  status: ConferenceStatus;
  featured?: boolean;
  /** Every record in this phase is development sample data. */
  isSample: true;
}

export interface ConferenceQuery {
  keyword?: string;
  topic?: string;
  country?: string;
  month?: string; // yyyy-mm
  continent?: string;
  page?: number;
  pageSize?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LabelledText {
  title: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Award {
  slug: string;
  name: string;
  description: string[];
  benefits?: LabelledText[];
}

export interface RegistrationFee {
  category: string;
  preEnrolment: number;
  standard: number;
}

export interface ScheduleItem {
  time: string;
  session: string;
  kind: 'session' | 'break' | 'ceremony';
}

export interface NavItem {
  label: string;
  to: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  to?: string;
  items?: NavItem[];
}
