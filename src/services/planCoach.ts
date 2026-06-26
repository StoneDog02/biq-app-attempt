import { format } from 'date-fns';
import type { EngagementTier, IntakeResponses, Profile } from '@/src/types/database';

function engagementTone(tier: EngagementTier): string {
  if (tier === 'light') return "Here's a light check-in for today.";
  if (tier === 'high_touch') return "Let's stay focused — you've got this today.";
  return "Here's your plan for today. Small steps add up.";
}

function weekdayGreeting(): string {
  const weekday = format(new Date(), 'EEEE');
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning — it's ${weekday}.`;
  if (hour < 17) return `Good afternoon — it's ${weekday}.`;
  return `Good evening — it's ${weekday}.`;
}

export function buildDailyCoachMessage(
  intake: IntakeResponses | null,
  profile: Profile | null
): string {
  const goal = String(intake?.goals?.primary_goal ?? 'your wellness goals').toLowerCase();
  const tier = profile?.engagement_tier ?? 'moderate';
  const greeting = weekdayGreeting();
  const tone = engagementTone(tier);

  return `${greeting} ${tone} Everything here supports ${goal}.`;
}
