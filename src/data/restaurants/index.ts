export type RestaurantItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  tags: string[];
  notes?: string;
};

export type RestaurantGuide = {
  id: string;
  name: string;
  tagline: string;
  items: RestaurantItem[];
};

export const RESTAURANT_GUIDES: RestaurantGuide[] = [
  {
    id: 'chipotle',
    name: 'Chipotle',
    tagline: 'Bowls and salads that travel well',
    items: [
      { id: 'c1', name: 'Chicken bowl (brown rice, fajita veggies, no sour cream)', calories: 510, protein: 42, tags: ['high_protein', 'balanced'] },
      { id: 'c2', name: 'Steak salad (lettuce, black beans, salsa, guac)', calories: 430, protein: 38, tags: ['high_protein', 'low_carb'] },
      { id: 'c3', name: 'Sofritas bowl (half rice, extra veggies)', calories: 480, protein: 22, tags: ['vegetarian', 'balanced'] },
      { id: 'c4', name: 'Chicken tacos (3 flour, salsa, lettuce)', calories: 620, protein: 36, tags: ['balanced'] },
    ],
  },
  {
    id: 'sweetgreen',
    name: 'Sweetgreen',
    tagline: 'Salads and warm bowls on the go',
    items: [
      { id: 's1', name: 'Harvest bowl (chicken)', calories: 490, protein: 35, tags: ['high_protein', 'balanced'] },
      { id: 's2', name: 'Kale Caesar (chicken, light dressing)', calories: 420, protein: 32, tags: ['high_protein', 'low_carb'] },
      { id: 's3', name: 'Guacamole Greens (tofu)', calories: 460, protein: 18, tags: ['vegetarian', 'balanced'] },
      { id: 's4', name: 'Chicken Pesto Parm warm bowl', calories: 540, protein: 38, tags: ['high_protein'] },
    ],
  },
  {
    id: 'chickfila',
    name: 'Chick-fil-A',
    tagline: 'Quick protein-forward picks',
    items: [
      { id: 'cf1', name: 'Grilled chicken sandwich', calories: 390, protein: 28, tags: ['high_protein', 'balanced'] },
      { id: 'cf2', name: 'Grilled nuggets (8 ct) + side salad', calories: 350, protein: 34, tags: ['high_protein', 'low_carb'] },
      { id: 'cf3', name: 'Market salad with grilled chicken', calories: 330, protein: 28, tags: ['high_protein', 'low_carb'] },
      { id: 'cf4', name: 'Egg white grill breakfast', calories: 290, protein: 26, tags: ['high_protein', 'low_carb'] },
    ],
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    tagline: 'Coffee runs without the sugar spike',
    items: [
      { id: 'sb1', name: 'Spinach, Feta & Egg White Wrap', calories: 290, protein: 20, tags: ['high_protein', 'balanced'] },
      { id: 'sb2', name: 'Grilled Chicken & Hummus Protein Box', calories: 300, protein: 22, tags: ['high_protein', 'balanced'] },
      { id: 'sb3', name: 'Oatmeal (plain) + nut mix', calories: 320, protein: 10, tags: ['vegetarian', 'balanced'] },
      { id: 'sb4', name: 'Caffè Latte (grande, 2% milk)', calories: 190, protein: 13, tags: ['balanced'] },
    ],
  },
];

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,;\n]+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

export function filterRestaurantItems(
  guide: RestaurantGuide,
  dietaryPrefs: Record<string, unknown>
): RestaurantItem[] {
  const dietType = String(dietaryPrefs.diet_type ?? '').toLowerCase();
  const restrictions = asStringList(dietaryPrefs.restrictions);

  return guide.items.filter((item) => {
    if (dietType.includes('vegetarian') || dietType.includes('vegan')) {
      if (item.tags.includes('high_protein') && !item.tags.includes('vegetarian')) {
        return item.tags.includes('vegetarian');
      }
    }
    if (restrictions.some((r) => r.toLowerCase().includes('low carb'))) {
      return item.tags.includes('low_carb') || item.tags.includes('balanced');
    }
    return true;
  });
}
