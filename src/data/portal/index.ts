export type PortalPrescription = {
  id: string;
  name: string;
  dosage: string;
  refillsRemaining: number;
  nextRefillDate: string;
};

export type PortalSubscription = {
  id: string;
  name: string;
  status: 'active' | 'paused';
  nextShipment: string;
  priceDisplay: string;
};

export type PortalServiceHistory = {
  id: string;
  date: string;
  type: string;
  summary: string;
};

export type PortalData = {
  planSummary: string;
  prescriptions: PortalPrescription[];
  subscriptions: PortalSubscription[];
  serviceHistory: PortalServiceHistory[];
};

export const MOCK_PORTAL_DATA: PortalData = {
  planSummary:
    'Your current wellness plan focuses on consistent movement, heart-healthy nutrition, and foundational supplementation. Your care team reviews this monthly.',
  prescriptions: [
    {
      id: 'rx1',
      name: 'Omega-3 Fish Oil',
      dosage: '1000 mg · once daily with lunch',
      refillsRemaining: 2,
      nextRefillDate: '2026-07-15',
    },
    {
      id: 'rx2',
      name: 'Vitamin D3',
      dosage: '2000 IU · once daily with breakfast',
      refillsRemaining: 1,
      nextRefillDate: '2026-07-01',
    },
  ],
  subscriptions: [
    {
      id: 'sub1',
      name: 'Daily Multivitamin',
      status: 'active',
      nextShipment: '2026-07-10',
      priceDisplay: '$32/mo',
    },
  ],
  serviceHistory: [
    {
      id: 'sh1',
      date: '2026-05-12',
      type: 'Telehealth visit',
      summary: 'Annual wellness check — discussed supplement plan and activity goals.',
    },
    {
      id: 'sh2',
      date: '2026-03-20',
      type: 'Lab review',
      summary: 'Longevity panel reviewed — vitamin D and ApoB within target ranges.',
    },
    {
      id: 'sh3',
      date: '2026-01-08',
      type: 'Plan update',
      summary: 'Care team adjusted supplement stack based on intake and lab results.',
    },
  ],
};

export function getPortalData(): PortalData {
  return MOCK_PORTAL_DATA;
}
