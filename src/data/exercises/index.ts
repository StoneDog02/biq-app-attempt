export type Exercise = {
  id: string;
  name: string;
  muscleGroups: string[];
  equipment: string;
  technique: string[];
  videoUrl: string | null;
};

export const EXERCISES: Exercise[] = [
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    muscleGroups: ['Quads', 'Glutes', 'Core'],
    equipment: 'Dumbbell or kettlebell',
    technique: ['Hold weight at chest', 'Sit hips back and down', 'Keep chest tall', 'Drive through mid-foot to stand'],
    videoUrl: null,
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Bodyweight',
    technique: ['Hands slightly wider than shoulders', 'Brace core — straight line head to heels', 'Lower with control', 'Press back up without sagging hips'],
    videoUrl: null,
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower back'],
    equipment: 'Barbell or dumbbells',
    technique: ['Soft knee bend', 'Hinge at hips pushing glutes back', 'Keep bar close to legs', 'Feel stretch in hamstrings, then squeeze glutes'],
    videoUrl: null,
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    muscleGroups: ['Lats', 'Upper back', 'Biceps'],
    equipment: 'Dumbbell + bench',
    technique: ['Flat back, hinge at hips', 'Pull elbow to hip', 'Squeeze shoulder blade', 'Lower with control'],
    videoUrl: null,
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    muscleGroups: ['Quads', 'Glutes', 'Balance'],
    equipment: 'Bodyweight or dumbbells',
    technique: ['Long step forward', 'Back knee drops toward floor', 'Torso upright', 'Push off front foot to next rep'],
    videoUrl: null,
  },
  {
    id: 'plank',
    name: 'Plank',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: 'Bodyweight',
    technique: ['Elbows under shoulders', 'Squeeze glutes and brace abs', 'Neutral neck', 'Hold without holding breath'],
    videoUrl: null,
  },
  {
    id: 'hip-bridge',
    name: 'Hip Bridge',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: 'Bodyweight',
    technique: ['Feet hip-width', 'Drive hips up', 'Pause at top', 'Lower without collapsing lower back'],
    videoUrl: null,
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    equipment: 'Dumbbells or barbell',
    technique: ['Ribs down, glutes tight', 'Press weight overhead in straight line', 'Avoid excessive back arch', 'Control the descent'],
    videoUrl: null,
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroups: ['Lats', 'Biceps'],
    equipment: 'Cable machine',
    technique: ['Grip slightly wider than shoulders', 'Pull bar to upper chest', 'Lead with elbows', 'Avoid leaning too far back'],
    videoUrl: null,
  },
  {
    id: 'bike-intervals',
    name: 'Bike Intervals',
    muscleGroups: ['Cardio', 'Legs'],
    equipment: 'Stationary bike',
    technique: ['Warm up 5 minutes easy', '30 sec hard / 90 sec easy x 6–8', 'Stay seated or stand as needed', 'Cool down 5 minutes'],
    videoUrl: null,
  },
  {
    id: 'box-step-up',
    name: 'Box Step-Up',
    muscleGroups: ['Quads', 'Glutes'],
    equipment: 'Box or bench',
    technique: ['Full foot on box', 'Drive through heel', 'Stand tall at top', 'Step down with control'],
    videoUrl: null,
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroups: ['Core', 'Hip stability'],
    equipment: 'Bodyweight',
    technique: ['Lower back pressed to floor', 'Opposite arm and leg extend', 'Exhale on extension', 'Move slowly — no rocking'],
    videoUrl: null,
  },
  {
    id: 'farmer-carry',
    name: 'Farmer Carry',
    muscleGroups: ['Grip', 'Core', 'Traps'],
    equipment: 'Dumbbells or kettlebells',
    technique: ['Stand tall, shoulders packed', 'Walk smooth controlled steps', 'Keep weights off thighs', 'Maintain steady breathing'],
    videoUrl: null,
  },
  {
    id: 'worlds-greatest-stretch',
    name: "World's Greatest Stretch",
    muscleGroups: ['Hips', 'Thoracic spine', 'Hamstrings'],
    equipment: 'Bodyweight',
    technique: ['Lunge forward, back knee down', 'Same-side elbow to instep', 'Rotate and reach arm up', 'Hold 2–3 breaths each side'],
    videoUrl: null,
  },
  {
    id: 'sled-push',
    name: 'Sled Push',
    muscleGroups: ['Legs', 'Cardio', 'Core'],
    equipment: 'Sled',
    technique: ['Low body angle, arms extended', 'Short powerful steps', 'Drive through balls of feet', 'Keep core braced throughout'],
    videoUrl: null,
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    muscleGroups: ['Quads', 'Glutes'],
    equipment: 'Wall',
    technique: ['Back flat against wall', 'Thighs parallel to floor if possible', 'Knees over ankles', 'Hold and breathe steadily'],
    videoUrl: null,
  },
  {
    id: 'band-pull-apart',
    name: 'Band Pull-Apart',
    muscleGroups: ['Rear delts', 'Upper back'],
    equipment: 'Resistance band',
    technique: ['Arms extended at shoulder height', 'Pull band apart to chest', 'Squeeze shoulder blades', 'Return with control'],
    videoUrl: null,
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    muscleGroups: ['Cardio', 'Calves', 'Coordination'],
    equipment: 'Jump rope',
    technique: ['Light bounce on balls of feet', 'Small wrist rotations', 'Stay tall — avoid excessive knee bend', 'Start with 30 sec intervals'],
    videoUrl: null,
  },
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function searchExercises(query: string): Exercise[] {
  const q = query.trim().toLowerCase();
  if (!q) return EXERCISES;
  return EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
      e.equipment.toLowerCase().includes(q)
  );
}
