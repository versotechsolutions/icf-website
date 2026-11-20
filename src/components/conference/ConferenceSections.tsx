import { CheckCircle2 } from 'lucide-react';
import { conferenceHighlights, conferenceRegistrationInfo, icicgbAbout } from '@/data/content';
import type { Conference } from '@/types';

/** "About the conference" text: the client-supplied text for ICICGB-26, or the client's About Conf template for others. */
function aboutParagraphs(c: Conference) {
  if (c.slug === 'icicgb-26') return icicgbAbout;
  return [
    `The ${c.title} (${c.acronym}), organized through the International Conference Forum (ICF), brings together scholars, researchers, academicians, and industry experts from around the world.`,
    `Through expert insights, research presentations, and professional networking opportunities, ${c.acronym} aims to promote academic excellence, encourage innovation, and strengthen collaboration between academia and industry.`,
  ];
}

export function AboutConferenceSection({ conference }: { conference: Conference }) {
  return (
    <section id="about" aria-labelledby="about-h">
      <h2 id="about-h" className="text-h2">
        About the conference
      </h2>
      <span className="rule-gold mt-4" aria-hidden />
      <div className="prose-icf mt-6 text-[1.075rem] leading-[1.75] text-ink/90">
        {aboutParagraphs(conference).map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </section>
  );
}

export function HighlightsSection() {
  return (
    <section id="highlights" aria-labelledby="hl-h">
      <h2 id="hl-h" className="text-h2">
        Conference highlights
      </h2>
      <span className="rule-gold mt-4" aria-hidden />
      <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {conferenceHighlights.map((h) => (
          <li key={h.title} className="flex gap-3">
            <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-globe-600" />
            <div>
              <h3 className="font-semibold text-navy-900">{h.title}</h3>
              <p className="mt-1 text-[0.98rem] leading-relaxed text-muted">{h.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RegistrationInfoSection() {
  return (
    <section id="registration" aria-labelledby="reg-h" className="rounded-[var(--radius-lg)] bg-navy-900 p-8 text-white sm:p-10">
      <h2 id="reg-h" className="text-h2 text-white">
        Registration information
      </h2>
      <ul className="mt-6 divide-y divide-white/10">
        {conferenceRegistrationInfo.map((r) => (
          <li key={r.title} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
            <h3 className="font-serif text-lg font-semibold text-gold-300">{r.title}</h3>
            <p className="text-white/80">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
