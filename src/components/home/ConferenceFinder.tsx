import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { topics } from '@/data/topics';
import { conferenceSnapshot } from '@/services/conferences';
import { formatMonthKey } from '@/utils/format';
import { CountryCombobox } from '@/components/forms/CountryCombobox';
import { Button } from '@/components/ui/Button';

/** Hero search instrument: the site's primary job is conference discovery. */
export function ConferenceFinder() {
  const navigate = useNavigate();
  const months = conferenceSnapshot.months();
  const countryOptions = conferenceSnapshot.countriesWithConferences();
  const [month, setMonth] = useState('');
  const [topic, setTopic] = useState('');
  const [country, setCountry] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (month) params.set('month', month);
    if (topic) params.set('topic', topic);
    const qs = params.toString();
    navigate(country ? `/conferences/${country}${qs ? `?${qs}` : ''}` : `/conferences${qs ? `?${qs}` : ''}`);
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Find a conference"
      className="grid gap-4 rounded-[var(--radius-lg)] bg-white p-5 shadow-[var(--shadow-panel)] sm:p-6 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="finder-month" className="text-[0.92rem] font-semibold text-navy-900">
          Month
        </label>
        <select id="finder-month" className="field-input" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Any month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonthKey(m)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="finder-topic" className="text-[0.92rem] font-semibold text-navy-900">
          Subject area
        </label>
        <select id="finder-topic" className="field-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All subject areas</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <CountryCombobox id="finder-country" label="Country" value={country} onChange={setCountry} placeholder="Any country" options={countryOptions} />
      <Button type="submit" size="lg" className="md:h-[2.875rem] md:py-0">
        <Search aria-hidden className="size-4" />
        Find conferences
      </Button>
    </form>
  );
}
