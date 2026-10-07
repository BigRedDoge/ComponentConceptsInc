import { Bell, ShieldAlert, Lightbulb, Package, type LucideIcon } from 'lucide-react';

export interface Offering {
  name: string;
  icon: LucideIcon;
}

export const offerings: Offering[] = [
  {
    name: 'Audible indicator',
    icon: Bell,
  },
  {
    name: 'Custom switches',
    icon: ShieldAlert,
  },
  {
    name: 'Specialty lighting',
    icon: Lightbulb,
  },
  {
    name: 'Custom component supply',
    icon: Package,
  },
];
