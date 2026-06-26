import type { MealsPerDay, NutritionProfile } from '@/src/types/database';

/**
 * Meal spacing is based on common clinical nutrition guidance:
 * - ~60 min after waking before the first meal (hydration, cortisol rhythm)
 * - ~3–4 h between main meals (postprandial glucose often normalizes in ~2–3 h for mixed meals)
 * - ~2–2.5 h after a main meal for snacks (bridges energy without stacking intake)
 * - Last meal typically within ~12–14 h of day start (supports overnight fasting window)
 *
 * References (general evidence, not personalized medical advice):
 * - American Diabetes Association — consistent meal timing and spacing for glycemic management
 * - Postprandial glucose dynamics — peak ~60–90 min, toward baseline ~2–3 h (mixed macronutrients)
 * - Protein distribution — spreading intake across 3–4+ eating occasions supports daily MPS targets
 */

export const DAY_START_OPTIONS = [
  { value: '05:00', label: '5:00 AM' },
  { value: '05:30', label: '5:30 AM' },
  { value: '06:00', label: '6:00 AM' },
  { value: '06:30', label: '6:30 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '07:30', label: '7:30 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '08:30', label: '8:30 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
] as const;

export const DEFAULT_DAY_START_TIME = '07:00';

/** Minutes after day_start for each slot count */
const MEAL_TIME_OFFSETS: Record<MealsPerDay, number[]> = {
  3: [60, 300, 600],
  4: [60, 300, 450, 630],
  5: [60, 210, 390, 540, 720],
  6: [60, 180, 330, 480, 630, 780],
};

const MEAL_TIMING_NOTES: Record<MealsPerDay, string[]> = {
  3: [
    'First meal ~1 h after you start your day',
    '~4 h after breakfast — room for blood sugar to settle',
    'Larger gap before dinner — supports afternoon energy',
  ],
  4: [
    'First meal ~1 h after you start your day',
    'Midday anchor meal',
    'Afternoon snack between lunch and dinner',
    'Evening meal with a buffer before wind-down',
  ],
  5: [
    'Protein-forward start ~1 h after day begins',
    'Mid-morning bridge snack',
    'Main midday meal',
    'Afternoon snack before glycemic dip',
    'Final meal within your active window',
  ],
  6: [
    'Early first meal after your morning routine',
    'Frequent, smaller gaps to hit macros steadily',
    'Midday main meal',
    'Afternoon snack',
    'Early evening meal',
    'Light final snack if needed for macro targets',
  ],
};

export type TimedMealSlot = {
  title: string;
  time24: string;
  timeLabel: string;
  timingNote: string;
};

export function parseTimeToMinutes(time24: string): number {
  const [hours, minutes] = time24.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime24(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatTime12h(time24: string): string {
  const [hourPart, minutePart] = time24.split(':');
  let hours = Number(hourPart);
  const minutes = minutePart ?? '00';
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${period}`;
}

function getDayStartTime(profile: NutritionProfile): string {
  return profile.day_start_time ?? DEFAULT_DAY_START_TIME;
}

function getScaledOffsets(mealsPerDay: MealsPerDay, dayStartMinutes: number): number[] {
  const offsets = [...MEAL_TIME_OFFSETS[mealsPerDay]];
  const lastAbsolute = dayStartMinutes + offsets[offsets.length - 1];
  const maxAllowed = dayStartMinutes + 14 * 60;

  if (lastAbsolute <= maxAllowed) return offsets;

  const scale = (14 * 60) / offsets[offsets.length - 1];
  return offsets.map((offset) => Math.round(offset * scale));
}

export function buildMealTimes(
  profile: NutritionProfile,
  slotTitles: string[]
): TimedMealSlot[] {
  const mealsPerDay = (profile.meals_per_day ?? 3) as MealsPerDay;
  const dayStart = getDayStartTime(profile);
  const dayStartMinutes = parseTimeToMinutes(dayStart);
  const offsets = getScaledOffsets(mealsPerDay, dayStartMinutes);
  const notes = MEAL_TIMING_NOTES[mealsPerDay];

  return slotTitles.map((title, index) => {
    const time24 = minutesToTime24(dayStartMinutes + offsets[index]);
    return {
      title,
      time24,
      timeLabel: formatTime12h(time24),
      timingNote: notes[index] ?? 'Spaced to allow digestion between meals',
    };
  });
}

export function getMealScheduleSummary(profile: NutritionProfile): string {
  const dayStart = getDayStartTime(profile);
  return `Day starts ${formatTime12h(dayStart)} · meals spaced for steady energy`;
}

export const MEAL_TIMING_FOOTNOTE =
  'Times are spaced ~3–4 h between main meals so your body can digest and blood sugar can settle before the next eating window. Not medical advice — adjust with your care team if needed.';
