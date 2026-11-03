import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { topics } from '@/data/topics';
import { CountryCombobox } from '@/components/forms/CountryCombobox';
import { Button } from '@/components/ui/Button';

/** Hero search instrument: the site's primary job is conference discovery. */
export function ConferenceFinder() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [topic, setTopic] = useState('');
  const [country, setCountry] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (topic) params.set('topic', topic);
    const qs = params.toString();
    navigate(country ? `/conferences/${country}${qs ? `?${qs}` : ''}` : `/conferences${qs ? `?${qs}` : ''}`);
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Find a conference"
      className="grid gap-4 rounded-[var(--radius-lg)] bg-white p-5 shadow-[var(--shadow-panel)] sm:p-6 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-end"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="finder-q" className="text-[0.92rem] font-semibold text-navy-900">
          Keyword
        </label>
        <input id="finder-q" className="field-input" placeholder="Conference title, city or acronym" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
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
      <CountryCombobox id="finder-country" label="Country" value={country} onChange={setCountry} placeholder="Any country" />
      <Button type="submit" size="lg" className="md:h-[2.875rem] md:py-0">
        <Search aria-hidden className="size-4" />
        Find conferences
      </Button>
    </form>
  );
}
