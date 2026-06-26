import { useRef, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useLogMeal } from '@/src/hooks/useNutrition';
import { analyzeFoodPhoto } from '@/src/services/foodPhoto';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { MealType } from '@/src/types/database';

export default function PhotoLogScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const logMeal = useLogMeal();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType] = useState<MealType>('lunch');

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setAnalyzing(true);
    setError(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      if (!photo?.base64) throw new Error('Could not capture photo');

      const estimate = await analyzeFoodPhoto(photo.base64);
      setName(estimate.name);
      setCalories(String(estimate.calories));
      setProtein(String(estimate.protein_g));
      setCarbs(String(estimate.carbs_g));
      setFat(String(estimate.fat_g));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Photo analysis unavailable. Deploy the analyze-food-photo Edge Function or enter manually.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Add a meal name.');
      return;
    }
    logMeal.mutate(
      {
        meal_type: mealType,
        name: name.trim(),
        calories: calories ? Number(calories) : null,
        protein_g: protein ? Number(protein) : null,
        carbs_g: carbs ? Number(carbs) : null,
        fat_g: fat ? Number(fat) : null,
        source: 'photo',
      },
      {
        onSuccess: () => router.back(),
        onError: (e) => setError(e instanceof Error ? e.message : 'Could not save'),
      }
    );
  };

  if (!permission) {
    return (
      <Screen>
        <ActivityIndicator color={colors.copper.base} />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Card title="Camera access" subtitle="Needed to estimate macros from a meal photo.">
          <Button title="Allow camera" onPress={requestPermission} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <Text style={styles.hint}>Capture your plate — estimates are approximate</Text>
      </View>

      <View style={styles.form}>
        {analyzing ? <ActivityIndicator color={colors.copper.base} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Capture & analyze" onPress={handleCapture} loading={analyzing} />
        <Input label="Meal name" value={name} onChangeText={setName} />
        <Input label="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" />
        <Input label="Protein (g)" value={protein} onChangeText={setProtein} keyboardType="numeric" />
        <Input label="Carbs (g)" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
        <Input label="Fat (g)" value={fat} onChangeText={setFat} keyboardType="numeric" />
        <Button title="Save to log" onPress={handleSave} loading={logMeal.isPending} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraWrap: {
    height: 280,
  },
  camera: {
    flex: 1,
  },
  hint: {
    color: colors.gray[500],
    textAlign: 'center',
    padding: spacing.sm,
    fontSize: fontSize.sm,
  },
  form: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  error: {
    color: '#ef4444',
    marginBottom: spacing.sm,
  },
});
