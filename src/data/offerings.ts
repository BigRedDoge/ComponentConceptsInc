import { Bell, ShieldAlert, Lightbulb, Package, type LucideIcon } from 'lucide-react';

export interface Offering {
  name: string;
  icon: LucideIcon;
}

export const offerings: Offering[] = [
  {
    name: 'Bus door chimes',
    icon: Bell,
  },
  {
    name: 'Fire alarm switches',
    icon: ShieldAlert,
  },
  {
    name: 'Train lighting',
    icon: Lightbulb,
  },
  {
    name: 'Component supply',
    icon: Package,
  },
];
