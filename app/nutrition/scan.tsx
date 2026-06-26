import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useLogMeal } from '@/src/hooks/useNutrition';
import { lookupBarcode } from '@/src/services/openFoodFacts';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { MealType } from '@/src/types/database';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const logMeal = useLogMeal();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState<MealType>('snack');
  const [barcode, setBarcode] = useState<string | null>(null);

  const handleBarcode = useCallback(
    async (data: string) => {
      if (!scanning || loading) return;
      setScanning(false);
      setLoading(true);
      setError(null);
      setBarcode(data);

      try {
        const product = await lookupBarcode(data);
        if (!product) {
          setError('Product not found in Open Food Facts. You can still save manually.');
          setProductName('');
          setCalories('');
        } else {
          setProductName(product.name);
          setCalories(product.calories != null ? String(product.calories) : '');
        }
      } catch {
        setError('Lookup failed. Enter details manually.');
      } finally {
        setLoading(false);
      }
    },
    [scanning, loading]
  );

  const handleSave = () => {
    if (!productName.trim()) {
      setError('Add a product name.');
      return;
    }
    logMeal.mutate(
      {
        meal_type: mealType,
        name: productName.trim(),
        calories: calories ? Number(calories) : null,
        source: 'barcode',
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
        <Card title="Camera access" subtitle="We need camera access to scan barcodes on packaged food.">
          <Button title="Allow camera" onPress={requestPermission} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      {scanning && !barcode ? (
        <View style={styles.cameraWrap}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
            onBarcodeScanned={({ data }) => handleBarcode(data)}
          />
          <Text style={styles.hint}>Point at a barcode</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        {loading ? <ActivityIndicator color={colors.copper.base} /> : null}
        {barcode ? <Text style={styles.barcode}>Barcode: {barcode}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Input label="Product name" value={productName} onChangeText={setProductName} />
        <Input
          label="Calories (optional)"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />

        <Button title="Save to today's log" onPress={handleSave} loading={logMeal.isPending} />
        {barcode ? (
          <Button
            title="Scan again"
            variant="secondary"
            onPress={() => {
              setBarcode(null);
              setScanning(true);
              setError(null);
            }}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraWrap: {
    height: 280,
    marginBottom: spacing.md,
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
  },
  barcode: {
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
  error: {
    color: '#ef4444',
    marginBottom: spacing.sm,
  },
});
