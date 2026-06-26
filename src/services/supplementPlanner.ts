import type { IntakeResponses, PlanItem } from '@/src/types/database';

function goalTags(goals: Record<string, unknown>): string[] {
  const primary = String(goals.primary_goal ?? '').toLowerCase();
  const tags: string[] = [];
  if (primary.includes('weight')) tags.push('weight', 'metabolic');
  if (primary.includes('heart') || primary.includes('cardio')) tags.push('heart', 'longevity');
  if (primary.includes('energy')) tags.push('energy');
  if (primary.includes('muscle') || primary.includes('strength')) tags.push('strength');
  if (primary.includes('longevity') || primary.includes('aging')) tags.push('longevity');
  if (tags.length === 0) tags.push('general');
  return tags;
}

export function buildPersonalizedSupplementsFromIntake(intake: IntakeResponses | null): PlanItem[] {
  const goals = intake?.goals ?? {};
  const health = intake?.health_history ?? {};
  const activity = String(intake?.activity?.activity_level ?? 'moderate');
  const tags = goalTags(goals);
  const items: PlanItem[] = [];

  items.push({
    id: 's1',
    title: 'Daily multivitamin',
    description: 'Take with breakfast — foundational support for your plan.',
  });

  if (activity === 'sedentary' || activity === 'light') {
    items.push({
      id: 's2',
      title: 'Vitamin D3',
      description: '2000 IU with a meal — especially helpful with limited outdoor time.',
    });
  }

  if (tags.includes('heart') || tags.includes('longevity')) {
    items.push({
      id: 's3',
      title: 'Omega-3',
      description: 'Take with lunch — supports heart and cognitive health.',
    });
  }

  if (String(health.conditions ?? '').toLowerCase().includes('joint')) {
    items.push({
      id: 's4',
      title: 'Collagen support',
      description: 'Evening dose — joint and connective tissue support.',
    });
  }

  if (items.length === 1 && tags.includes('energy')) {
    items.push({
      id: 's2',
      title: 'B-complex',
      description: 'Morning with food — steady energy without stimulants.',
    });
  }

  return items.slice(0, 3);
}
