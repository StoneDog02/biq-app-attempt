import { create } from 'zustand';
import type { OnboardingStep, OnboardingStepData } from '@/src/types/onboarding';
import { ONBOARDING_STEPS } from '@/src/types/onboarding';

type OnboardingStore = {
  currentStepIndex: number;
  data: OnboardingStepData;
  setStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: OnboardingStepData) => void;
  reset: () => void;
  currentStep: OnboardingStep;
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentStepIndex: 0,
  data: {},
  currentStep: ONBOARDING_STEPS[0],
  setStepIndex: (index) =>
    set({
      currentStepIndex: index,
      currentStep: ONBOARDING_STEPS[index] ?? 'welcome',
    }),
  nextStep: () => {
    const next = Math.min(get().currentStepIndex + 1, ONBOARDING_STEPS.length - 1);
    set({ currentStepIndex: next, currentStep: ONBOARDING_STEPS[next] });
  },
  prevStep: () => {
    const prev = Math.max(get().currentStepIndex - 1, 0);
    set({ currentStepIndex: prev, currentStep: ONBOARDING_STEPS[prev] });
  },
  updateData: (partial) => set({ data: { ...get().data, ...partial } }),
  reset: () =>
    set({
      currentStepIndex: 0,
      data: {},
      currentStep: ONBOARDING_STEPS[0],
    }),
}));
