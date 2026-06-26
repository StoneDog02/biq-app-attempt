import type { IntakeResponses, PlanItem } from '@/src/types/database';

export type WorkoutProgram = {
  id: string;
  name: string;
  tagline: string;
  durationWeeks: number;
  daysPerWeek: number;
  tags: string[];
  sampleWeek: string[];
};

export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  {
    id: 'mobility-starter',
    name: 'Mobility Starter',
    tagline: 'Gentle daily movement for sedentary or light activity levels',
    durationWeeks: 4,
    daysPerWeek: 3,
    tags: ['beginner', 'mobility', 'low_impact'],
    sampleWeek: [
      'Mon: 10-min hip + shoulder mobility',
      'Wed: 15-min walk + core activation',
      'Fri: Full-body stretch flow',
    ],
  },
  {
    id: 'full-body-strength',
    name: 'Full-Body Strength',
    tagline: 'Balanced strength for moderate activity levels',
    durationWeeks: 6,
    daysPerWeek: 3,
    tags: ['strength', 'moderate'],
    sampleWeek: [
      'Mon: Squat + push + row circuit',
      'Wed: Hinge + lunge + carry',
      'Fri: Upper body + core',
    ],
  },
  {
    id: 'hyrox-style',
    name: 'Hyrox-Style Conditioning',
    tagline: 'Run + functional work for active athletes',
    durationWeeks: 8,
    daysPerWeek: 4,
    tags: ['conditioning', 'hyrox', 'active'],
    sampleWeek: [
      'Mon: 2 km run + sled push intervals',
      'Wed: Row + burpee ladder',
      'Fri: Tempo run + wall balls',
      'Sat: Long zone-2 run',
    ],
  },
  {
    id: 'marathon-base',
    name: 'Marathon Base',
    tagline: 'Build aerobic capacity for distance goals',
    durationWeeks: 12,
    daysPerWeek: 4,
    tags: ['endurance', 'running', 'marathon'],
    sampleWeek: [
      'Mon: Easy 30-min run',
      'Wed: Tempo intervals',
      'Fri: Cross-train or mobility',
      'Sun: Long slow distance',
    ],
  },
  {
    id: 'cycling-fitness',
    name: 'Cycling Fitness',
    tagline: 'Low-impact cardio for cycling enthusiasts',
    durationWeeks: 6,
    daysPerWeek: 3,
    tags: ['cycling', 'cardio', 'low_impact'],
    sampleWeek: [
      'Mon: 40-min steady ride',
      'Wed: Hill repeats or spin intervals',
      'Sat: Long outdoor or indoor ride',
    ],
  },
  {
    id: 'sport-maintenance',
    name: 'Sport Maintenance',
    tagline: 'Stay sharp between seasons with mixed training',
    durationWeeks: 4,
    daysPerWeek: 3,
    tags: ['sport', 'mixed'],
    sampleWeek: [
      'Mon: Agility + plyometrics',
      'Wed: Strength maintenance',
      'Fri: Sport-specific conditioning',
    ],
  },
];

export function filterPrograms(intake: IntakeResponses | null): WorkoutProgram[] {
  const activity = String(intake?.activity?.activity_level ?? 'moderate');
  const goals = String(intake?.goals?.primary_goal ?? '').toLowerCase();
  const preferred = String(intake?.activity?.preferred_activities ?? '').toLowerCase();

  return WORKOUT_PROGRAMS.filter((program) => {
    if (activity === 'sedentary' || activity === 'light') {
      return program.tags.includes('beginner') || program.tags.includes('mobility');
    }
    if (goals.includes('marathon') || goals.includes('run') || preferred.includes('run')) {
      return program.id === 'marathon-base' || program.tags.includes('endurance');
    }
    if (preferred.includes('cycl') || goals.includes('cycl')) {
      return program.id === 'cycling-fitness' || program.tags.includes('cycling');
    }
    if (activity === 'very_active' || activity === 'active') {
      if (goals.includes('hyrox') || preferred.includes('crossfit') || preferred.includes('hyrox')) {
        return program.id === 'hyrox-style' || program.tags.includes('conditioning');
      }
      return program.tags.includes('active') || program.tags.includes('strength');
    }
    return program.id === 'full-body-strength' || program.tags.includes('moderate');
  });
}

export function getProgramById(id: string): WorkoutProgram | undefined {
  return WORKOUT_PROGRAMS.find((p) => p.id === id);
}
