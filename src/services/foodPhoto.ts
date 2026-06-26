import { supabase } from '@/src/lib/supabase';

export type PhotoMacroEstimate = {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: string;
};

export async function analyzeFoodPhoto(base64Image: string): Promise<PhotoMacroEstimate> {
  const { data, error } = await supabase.functions.invoke('analyze-food-photo', {
    body: { image: base64Image },
  });

  if (error) throw error;
  if (!data || data.error) {
    throw new Error(data?.error ?? 'Photo analysis failed');
  }

  return data as PhotoMacroEstimate;
}
