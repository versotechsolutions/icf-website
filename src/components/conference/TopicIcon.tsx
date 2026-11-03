import { Atom, BriefcaseBusiness, Cpu, GraduationCap, Landmark, Map, Network, Scale, Sigma, Stethoscope, type LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  'business-and-economics': BriefcaseBusiness,
  education: GraduationCap,
  'engineering-and-technology': Cpu,
  'health-and-medicine': Stethoscope,
  interdisciplinary: Network,
  law: Scale,
  'mathematics-and-statistics': Sigma,
  'physical-and-life-sciences': Atom,
  'regional-studies': Map,
  'social-sciences-and-humanities': Landmark,
};

export function TopicIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? Network;
  return <Icon aria-hidden className={className} strokeWidth={1.6} />;
}
