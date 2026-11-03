import {
  Camera,
  Clock,
  Coins,
  Globe2,
  Handshake,
  Headphones,
  Laptop,
  Library,
  Lock,
  MessagesSquare,
  MonitorPlay,
  MonitorUp,
  Presentation,
  ShieldCheck,
  Users,
  Video,
  Wifi,
  AppWindow,
  Mic,
  Home,
  UserCheck,
} from 'lucide-react';
import { videoConferencing as vc } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { ContactBlock } from '@/components/layout/ContactBlock';

const benefitIcons = [Globe2, Presentation, Users, MessagesSquare, Handshake, Coins, Home, Library];
const featureIcons = [MonitorPlay, Presentation, MessagesSquare, MonitorUp, Video, Users, Lock, Globe2];
const reqIcons = [Laptop, Wifi, AppWindow, Headphones, Camera];
const etiquetteIcons = [Clock, UserCheck, ShieldCheck];

export default function VideoConferencingPage() {
  usePageMeta('Video conferencing', 'Join ICF conferences online: benefits, features, how to join, technical requirements and etiquette.');
  return (
    <>
      <PageHeader title="Video conferencing" crumbs={[{ label: 'Conference information' }, { label: 'Video conferencing' }]} intro={vc.intro[0]} />
      <EventInfoLayout>
        <p className="max-w-[66ch] font-serif text-[1.3rem] leading-relaxed text-navy-900">{vc.intro[1]}</p>

        <section aria-labelledby="ben-h" className="mt-14">
          <h2 id="ben-h" className="text-h2">
            Benefits of video conferencing at ICF
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <ul className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {vc.benefits.map((b, i) => {
              const I = benefitIcons[i];
              return (
                <li key={b.title} className="flex gap-4">
                  <I aria-hidden className="mt-0.5 size-6 shrink-0 text-globe-600" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-semibold text-navy-900">{b.title}</h3>
                    <p className="mt-1 text-[0.97rem] leading-relaxed text-muted">{b.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="feat-h" className="mt-16 rounded-[var(--radius-lg)] bg-navy-900 p-7 text-white sm:p-10">
          <h2 id="feat-h" className="text-h2 text-white">
            Key features
          </h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-md)] bg-white/10 sm:grid-cols-2">
            {vc.features.map((f, i) => {
              const I = featureIcons[i];
              return (
                <li key={f.title} className="bg-navy-900 p-5">
                  <I aria-hidden className="size-5 text-gold-300" strokeWidth={1.6} />
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-white/70">{f.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="join-h" className="mt-16">
          <h2 id="join-h" className="text-h2">
            How to join a video conference
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <ol className="relative mt-8 space-y-0">
            {vc.steps.map((s, i) => (
              <li key={s.title} className="relative grid grid-cols-[3rem_1fr] gap-4 pb-8 last:pb-0">
                {i < vc.steps.length - 1 && <span className="absolute left-[1.375rem] top-12 bottom-0 w-px bg-navy-100" aria-hidden />}
                <span className="relative inline-flex size-11 items-center justify-center rounded-full border border-gold-500 bg-white font-serif text-lg font-semibold text-navy-900">
                  {i + 1}
                </span>
                <div className="pt-2">
                  <h3 className="font-serif text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink/85">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="tech-h" className="mt-16">
          <h2 id="tech-h" className="text-h2">
            Technical requirements
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <ul className="mt-8 divide-y divide-rule rounded-[var(--radius-lg)] border border-rule">
            {vc.requirements.map((r, i) => {
              const I = reqIcons[i] ?? Mic;
              return (
                <li key={r.title} className="flex gap-4 px-5 py-4">
                  <I aria-hidden className="mt-0.5 size-5 shrink-0 text-globe-600" strokeWidth={1.6} />
                  <p>
                    <span className="font-semibold text-navy-900">{r.title}: </span>
                    <span className="text-ink/85">{r.text}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="eti-h" className="mt-16">
          <h2 id="eti-h" className="text-h2">
            Conference etiquette
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {vc.etiquette.map((e, i) => {
              const I = etiquetteIcons[i];
              return (
                <li key={e.title} className="rounded-[var(--radius-lg)] border-t-2 border-gold-500 bg-mist p-6">
                  <I aria-hidden className="size-6 text-navy-800" strokeWidth={1.5} />
                  <h3 className="mt-3 font-serif text-lg font-semibold">{e.title}</h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{e.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <ContactBlock className="mt-16" intro="For further inquiries or support related to video conferencing at International Conference Forum events, feel free to contact us." />
      </EventInfoLayout>
    </>
  );
}
