import { useState } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useLogMeal } from '@/src/hooks/useNutrition';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { MealType } from '@/src/types/database';

type VoiceModule = {
  start: (locale: string) => Promise<void>;
  stop: () => Promise<void>;
  destroy: () => Promise<void>;
  onSpeechResults: (handler: (e: { value?: string[] }) => void) => void;
  onSpeechError: (handler: () => void) => void;
  removeAllListeners: () => void;
};

async function loadVoiceModule(): Promise<VoiceModule | null> {
  try {
    const mod = await import('@react-native-voice/voice');
    return mod.default as unknown as VoiceModule;
  } catch {
    return null;
  }
}

export default function VoiceLogScreen() {
  const router = useRouter();
  const logMeal = useLogMeal();
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceModule, setVoiceModule] = useState<VoiceModule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mealType] = useState<MealType>('lunch');

  const voiceAvailable = voiceModule !== null;

  const toggleListening = async () => {
    setError(null);

    let voice = voiceModule;
    if (!voice) {
      voice = await loadVoiceModule();
      if (!voice) {
        setError('Voice requires a development build. Type your meal or use keyboard dictation.');
        return;
      }
      voice.onSpeechResults = (e) => {
        const text = e.value?.[0];
        if (text) setTranscript(text);
      };
      voice.onSpeechError = () => {
        setListening(false);
        setError('Voice capture stopped. You can edit the text below.');
      };
      setVoiceModule(voice);
    }

    try {
      if (listening) {
        await voice.stop();
        setListening(false);
        return;
      }

      await voice.start(Platform.OS === 'ios' ? 'en-US' : 'en_US');
      setListening(true);
    } catch {
      setError('Voice requires a development build. Type your meal or use keyboard dictation.');
      setListening(false);
    }
  };

  const handleSave = () => {
    if (!transcript.trim()) {
      setError('Describe what you ate.');
      return;
    }
    logMeal.mutate(
      {
        meal_type: mealType,
        name: transcript.trim(),
        source: 'voice',
      },
      {
        onSuccess: () => router.back(),
        onError: (e) => setError(e instanceof Error ? e.message : 'Could not save'),
      }
    );
  };

  return (
    <Screen>
      <Card
        title="Voice log"
        subtitle="Say what you ate — or type it. No judgment, just a quick record."
      >
        <Text style={styles.note}>
          {voiceAvailable
            ? 'Tap below to capture by voice, or type directly.'
            : 'In Expo Go, use the text field or your keyboard microphone. Native voice works in a dev build.'}
        </Text>

        <Input
          label="What did you eat?"
          value={transcript}
          onChangeText={setTranscript}
          placeholder="Grilled salmon with rice and broccoli"
          multiline
        />

        <Button
          title={listening ? 'Stop listening' : 'Start voice capture'}
          variant="secondary"
          onPress={toggleListening}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Save to log" onPress={handleSave} loading={logMeal.isPending} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    color: colors.gray[500],
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  error: {
    color: '#ef4444',
    marginVertical: spacing.sm,
  },
});
