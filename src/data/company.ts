export interface CompanyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Company {
  legalName: string;
  tagline: string;
  email: string;
  phone: string;
  foundedYear: string;
  address: CompanyAddress;
  /** Whether the street address is published, or only city/state. See docs/TASKS.md Phase 0. */
  addressPublic: boolean;
}

// TODO(sean): Real contact details, founding year, and address disposition.
// Values below are placeholders and must not be treated as real. See docs/TASKS.md Phase 0.
export const company: Company = {
  legalName: 'Component Concepts, Inc.',
  tagline: 'Custom Component Manufacturing in the USA',
  email: 'seancliff01@gmail.com',
  phone: '860-921-1808',
  foundedYear: '1980',
  address: {
    street: '2113 Main St.',
    city: 'Hartford',
    state: 'CT',
    zip: '06120',
  },
  addressPublic: false,
};
