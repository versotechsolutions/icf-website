import { Award, BookOpenCheck, Compass, Globe2, Handshake, Lightbulb, Presentation, Scale, Search, Sprout, Users } from 'lucide-react';
import { aboutIntro, coreValues, mission, vision, visionForExcellence, whyChooseIcf } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';

const valueIcons = [Award, Globe2, Lightbulb, Scale];
const whyIcons = [Search, Presentation, Users, Compass, Sprout];
const excellenceIcons = [Globe2, Lightbulb, Handshake];

export default function AboutPage() {
  usePageMeta('About ICF', 'About International Conference Forum (ICF): our mission, vision, core values and why researchers choose ICF.');
  return (
    <>
      <PageHeader title="About International Conference Forum (ICF)" crumbs={[{ label: 'About ICF' }]} intro={aboutIntro[0]} />

      {/* Introduction — editorial two-column */}
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <div>
            <BookOpenCheck aria-hidden className="size-10 text-gold-500" strokeWidth={1.3} />
            <p className="mt-6 font-serif text-[1.65rem] leading-snug text-navy-900">{aboutIntro[1]}</p>
          </div>
          <div className="prose-icf text-[1.075rem] leading-[1.75] text-ink/90">
            <p>{aboutIntro[0]}</p>
            <p>{aboutIntro[2]}</p>
          </div>
        </Container>
      </section>

      {/* Mission and vision — paired panels */}
      <section className="pb-20" aria-label="Mission and vision">
        <Container className="grid overflow-hidden rounded-[var(--radius-lg)] md:grid-cols-2">
          <div className="bg-navy-900 p-8 text-white sm:p-12">
            <h2 className="text-h2 text-white">Our mission</h2>
            <span className="rule-gold mt-4" aria-hidden />
            <p className="mt-6 text-lg leading-relaxed text-white/85">{mission}</p>
          </div>
          <div className="border border-rule bg-white p-8 max-md:border-t-0 md:border-l-0 sm:p-12">
            <h2 className="text-h2">Our vision</h2>
            <span className="rule-gold mt-4" aria-hidden />
            <p className="mt-6 text-lg leading-relaxed text-ink/85">{vision}</p>
          </div>
        </Container>
      </section>

      {/* Vision for excellence */}
      <section className="border-y border-rule bg-mist py-20" aria-labelledby="excellence">
        <Container>
          <SectionHeading id="excellence" title="Our vision for excellence" />
          <ul className="mt-10 grid gap-10 md:grid-cols-3">
            {visionForExcellence.map((v, i) => {
              const Icon = excellenceIcons[i];
              return (
                <li key={v.title} className="border-t-2 border-navy-900 pt-6">
                  <Icon aria-hidden className="size-7 text-globe-600" strokeWidth={1.5} />
                  <h3 className="mt-4 text-h3">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Core values — 2x2 with icon medallions */}
      <section className="py-20" aria-labelledby="values">
        <Container className="grid items-start gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeading id="values" className="lg:sticky lg:top-28" title="Our core values" intro="The principles that guide how ICF conferences are organised and how we work with participants." />
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {coreValues.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <li key={v.title} className="flex gap-5">
                  <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-gold-500/60 bg-gold-50 text-gold-700">
                    <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.25rem] font-semibold">{v.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Why choose ICF — navy list */}
      <section className="bg-navy-900 py-20 text-white" aria-labelledby="why">
        <Container>
          <SectionHeading id="why" tone="dark" title="Why choose ICF?" />
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {whyChooseIcf.map((w, i) => {
              const Icon = whyIcons[i];
              return (
                <li key={w.title} className="grid gap-3 py-6 md:grid-cols-[3rem_18rem_1fr] md:items-baseline md:gap-8">
                  <Icon aria-hidden className="size-6 text-gold-400" strokeWidth={1.5} />
                  <h3 className="font-serif text-[1.25rem] font-semibold text-white">{w.title}</h3>
                  <p className="leading-relaxed text-white/75">{w.text}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/conferences" variant="gold">
              View upcoming conferences
            </ButtonLink>
            <ButtonLink to="/contact" variant="onDark">
              Contact the ICF team
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
