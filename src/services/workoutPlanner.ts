import type { IntakeResponses, PlanItem } from '@/src/types/database';

function primaryGoalCopy(goals: Record<string, unknown>): string {
  const goal = String(goals.primary_goal ?? 'wellness');
  if (goal.toLowerCase().includes('weight')) return 'consistent movement and recovery';
  if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('strength')) {
    return 'progressive strength work';
  }
  if (goal.toLowerCase().includes('energy')) return 'movement that boosts daily energy';
  return goal.toLowerCase();
}

export function buildPersonalizedWorkoutsFromIntake(intake: IntakeResponses | null): PlanItem[] {
  const activity = String(intake?.activity?.activity_level ?? 'moderate');
  const goals = intake?.goals ?? {};
  const preferred = String(intake?.activity?.preferred_activities ?? '').toLowerCase();
  const goalFocus = primaryGoalCopy(goals);

  if (activity === 'sedentary' || activity === 'light') {
    return [
      {
        id: 'w1',
        title: 'Morning mobility',
        description: '10 minutes — hips, shoulders, and spine. Easy wins to start the day.',
      },
      {
        id: 'w2',
        title: 'Afternoon walk',
        description: '15–20 minute walk. Focus on posture and steady breathing.',
      },
    ];
  }

  if (preferred.includes('run') || String(goals.primary_goal ?? '').toLowerCase().includes('marathon')) {
    return [
      {
        id: 'w1',
        title: 'Easy run',
        description: `30 minutes zone 2. Supports ${goalFocus}.`,
      },
      {
        id: 'w2',
        title: 'Mobility reset',
        description: '10 minutes post-run stretching — calves, hips, hamstrings.',
      },
    ];
  }

  if (preferred.includes('cycl')) {
    return [
      {
        id: 'w1',
        title: 'Steady ride',
        description: '40 minutes moderate effort. Keep cadence smooth.',
      },
      {
        id: 'w2',
        title: 'Core + hip stability',
        description: '10 minutes — dead bugs, hip bridges, band work.',
      },
    ];
  }

  if (activity === 'very_active' || activity === 'active') {
    return [
      {
        id: 'w1',
        title: 'Conditioning session',
        description: `25 minutes — intervals matched to ${goalFocus}.`,
      },
      {
        id: 'w2',
        title: 'Recovery mobility',
        description: '10 minutes foam roll and stretch. Protect your joints.',
      },
    ];
  }

  return [
    {
      id: 'w1',
      title: 'Full-body strength',
      description: `25 minutes — squat, push, hinge, row. Built for ${goalFocus}.`,
    },
    {
      id: 'w2',
      title: 'Walk or light cardio',
      description: '20 minutes easy movement to aid recovery.',
    },
  ];
}
