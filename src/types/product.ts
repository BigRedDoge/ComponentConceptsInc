export type Category = 'chime' | 'alarm' | 'lighting';

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  code: string; // e.g. "CC-1042"
  name: string;
  category: Category;
  summary: string; // one line, used on the dataplate
  description: string; // 2-3 sentences
  specs: Spec[];
  datasheetUrl?: string;
  images?: string[]; // reserved — empty today, populated if photos ever exist
}
