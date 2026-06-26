import type { IntakeResponses } from '@/src/types/database';
import type { ProductCategory } from '@/src/types/database';

export type Product = {
  id: string;
  title: string;
  category: ProductCategory;
  description: string;
  priceDisplay: string;
  recommendedFor: string[];
  inPlan: boolean;
  ingredients?: string;
};

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  supplements: 'Supplements',
  tests: 'Lab tests',
  glp1: 'GLP-1',
  peptides: 'Peptides',
};

export const PRODUCTS: Product[] = [
  {
    id: 'multivitamin-daily',
    title: 'Daily Multivitamin',
    category: 'supplements',
    description: 'Broad-spectrum vitamins and minerals for everyday wellness support.',
    priceDisplay: '$32/mo',
    recommendedFor: ['general', 'energy'],
    inPlan: true,
    ingredients: 'Vitamin A, C, D, E, B-complex, zinc, magnesium',
  },
  {
    id: 'vitamin-d3',
    title: 'Vitamin D3 2000 IU',
    category: 'supplements',
    description: 'Supports bone health, immunity, and mood — especially with limited sun exposure.',
    priceDisplay: '$18/mo',
    recommendedFor: ['general', 'longevity'],
    inPlan: false,
  },
  {
    id: 'omega-3',
    title: 'Omega-3 Fish Oil',
    category: 'supplements',
    description: 'EPA/DHA for heart, brain, and joint health.',
    priceDisplay: '$28/mo',
    recommendedFor: ['heart', 'longevity'],
    inPlan: true,
    ingredients: '1000 mg EPA/DHA per serving',
  },
  {
    id: 'collagen',
    title: 'Collagen Peptides',
    category: 'supplements',
    description: 'Type I and III collagen for skin, joint, and connective tissue support.',
    priceDisplay: '$35/mo',
    recommendedFor: ['strength', 'longevity'],
    inPlan: false,
  },
  {
    id: 'b-complex',
    title: 'B-Complex Energy',
    category: 'supplements',
    description: 'B vitamins for steady energy metabolism without stimulants.',
    priceDisplay: '$22/mo',
    recommendedFor: ['energy'],
    inPlan: false,
  },
  {
    id: 'magnesium',
    title: 'Magnesium Glycinate',
    category: 'supplements',
    description: 'Gentle form for sleep, muscle recovery, and stress support.',
    priceDisplay: '$24/mo',
    recommendedFor: ['energy', 'strength'],
    inPlan: false,
  },
  {
    id: 'longevity-panel',
    title: 'Longevity Lab Panel',
    category: 'tests',
    description: 'Comprehensive biomarkers: ApoB, hs-CRP, HbA1c, vitamin D, and more.',
    priceDisplay: '$249',
    recommendedFor: ['longevity', 'heart'],
    inPlan: false,
  },
  {
    id: 'metabolic-panel',
    title: 'Metabolic Health Panel',
    category: 'tests',
    description: 'Fasting glucose, insulin, lipids — baseline metabolic snapshot.',
    priceDisplay: '$149',
    recommendedFor: ['weight', 'metabolic'],
    inPlan: false,
  },
  {
    id: 'micronutrient-test',
    title: 'Micronutrient Test',
    category: 'tests',
    description: 'Identify gaps in vitamins and minerals to personalize supplementation.',
    priceDisplay: '$199',
    recommendedFor: ['general'],
    inPlan: false,
  },
  {
    id: 'glp1-consult',
    title: 'GLP-1 Telehealth Consult',
    category: 'glp1',
    description: 'Licensed clinician visit to discuss GLP-1 eligibility and your wellness plan.',
    priceDisplay: 'From $99',
    recommendedFor: ['weight', 'metabolic'],
    inPlan: false,
  },
  {
    id: 'glp1-program',
    title: 'GLP-1 Support Program',
    category: 'glp1',
    description: 'Ongoing coaching plus medication management when clinically appropriate.',
    priceDisplay: 'From $299/mo',
    recommendedFor: ['weight', 'metabolic'],
    inPlan: false,
  },
  {
    id: 'bpc157',
    title: 'BPC-157 Peptide',
    category: 'peptides',
    description: 'Recovery-focused peptide — requires telehealth evaluation first.',
    priceDisplay: 'Consult required',
    recommendedFor: ['strength'],
    inPlan: false,
  },
  {
    id: 'cjc-ipamorelin',
    title: 'CJC / Ipamorelin',
    category: 'peptides',
    description: 'Sleep and recovery peptide stack — clinician-guided only.',
    priceDisplay: 'Consult required',
    recommendedFor: ['longevity', 'strength'],
    inPlan: false,
  },
  {
    id: 'probiotic',
    title: 'Daily Probiotic',
    category: 'supplements',
    description: 'Multi-strain probiotic for gut health and immune support.',
    priceDisplay: '$26/mo',
    recommendedFor: ['general'],
    inPlan: false,
  },
  {
    id: 'protein-powder',
    title: 'Clean Protein Powder',
    category: 'supplements',
    description: 'Grass-fed whey isolate — 25g protein per serving, minimal additives.',
    priceDisplay: '$45/mo',
    recommendedFor: ['strength', 'weight'],
    inPlan: false,
  },
  {
    id: 'hormone-panel',
    title: 'Hormone Balance Panel',
    category: 'tests',
    description: 'Thyroid, testosterone, cortisol — for personalized longevity planning.',
    priceDisplay: '$279',
    recommendedFor: ['longevity', 'energy'],
    inPlan: false,
  },
];

function intakeGoalTags(intake: IntakeResponses | null): string[] {
  const primary = String(intake?.goals?.primary_goal ?? '').toLowerCase();
  const tags: string[] = ['general'];
  if (primary.includes('weight')) tags.push('weight', 'metabolic');
  if (primary.includes('heart') || primary.includes('cardio')) tags.push('heart');
  if (primary.includes('energy')) tags.push('energy');
  if (primary.includes('muscle') || primary.includes('strength')) tags.push('strength');
  if (primary.includes('longevity') || primary.includes('aging')) tags.push('longevity');
  return tags;
}

export function filterProducts(
  intake: IntakeResponses | null,
  category?: ProductCategory | 'all'
): Product[] {
  const tags = intakeGoalTags(intake);
  let list = PRODUCTS;

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  return [...list].sort((a, b) => {
    const aMatch = a.recommendedFor.some((t) => tags.includes(t)) || a.inPlan;
    const bMatch = b.recommendedFor.some((t) => tags.includes(t)) || b.inPlan;
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function matchesPlan(product: Product, intake: IntakeResponses | null): boolean {
  if (product.inPlan) return true;
  const tags = intakeGoalTags(intake);
  return product.recommendedFor.some((t) => tags.includes(t));
}
