import { Bell, ShieldAlert, Lightbulb, type LucideIcon } from 'lucide-react';
import type { Category } from '../types/product';

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  chime:    { label: 'Door Chime',        icon: Bell },
  alarm:    { label: 'Alarm Switch',      icon: ShieldAlert },
  lighting: { label: 'Interior Lighting', icon: Lightbulb },
};
