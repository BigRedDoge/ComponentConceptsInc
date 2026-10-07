import { Bell, ShieldAlert, Lightbulb, Package, type LucideIcon } from 'lucide-react';

export interface Offering {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const offerings: Offering[] = [
  {
    name: 'Bus door chimes',
    description:
      'Audible alerts that warn passengers when doors are opening or closing, built for the noise and vibration of daily bus service.',
    icon: Bell,
  },
  {
    name: 'Fire alarm switches',
    description: 'Switches that tie into on-board fire detection and alarm systems.',
    icon: ShieldAlert,
  },
  {
    name: 'Train lighting',
    description:
      'Interior lighting for rail cars, as original equipment or as replacements on older fleets.',
    icon: Lightbulb,
  },
  {
    name: 'Component supply',
    description:
      'Sourcing and supply of transit components, so fleets can keep vehicles in service.',
    icon: Package,
  },
];
