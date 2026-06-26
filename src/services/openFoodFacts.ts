export type OpenFoodFactsProduct = {
  name: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  barcode: string;
};

export async function lookupBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`
  );

  if (!response.ok) return null;

  const json = (await response.json()) as {
    status?: number;
    product?: {
      product_name?: string;
      nutriments?: {
        'energy-kcal_100g'?: number;
        'energy-kcal_serving'?: number;
        proteins_100g?: number;
        carbohydrates_100g?: number;
        fat_100g?: number;
        proteins_serving?: number;
        carbohydrates_serving?: number;
        fat_serving?: number;
      };
    };
  };

  if (json.status !== 1 || !json.product) return null;

  const n = json.product.nutriments ?? {};
  const calories = n['energy-kcal_serving'] ?? n['energy-kcal_100g'] ?? null;

  return {
    name: json.product.product_name?.trim() || 'Unknown product',
    calories: calories != null ? Math.round(calories) : null,
    protein_g: n.proteins_serving ?? n.proteins_100g ?? null,
    carbs_g: n.carbohydrates_serving ?? n.carbohydrates_100g ?? null,
    fat_g: n.fat_serving ?? n.fat_100g ?? null,
    barcode,
  };
}
