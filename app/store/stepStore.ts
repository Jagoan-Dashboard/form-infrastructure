// store/stepStore.ts
import { create } from 'zustand';
import { ALL_STEPS } from '~/const/sidebar_step';
import type { SidebarStep } from '~/types/sidebar';
import type { NavigateFunction } from 'react-router';

interface StepStore {
  currentStep: SidebarStep;
  navigate: NavigateFunction | null;
  setNavigate: (nav: NavigateFunction) => void;
  setStep: (step: SidebarStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
}

export const useStepStore = create<StepStore>((set, get) => ({
  currentStep: ALL_STEPS[0],
  navigate: null,

  setNavigate: (nav) => set({ navigate: nav }),

  setStep: (step) => {
    set({ currentStep: step });
    const { navigate } = get();
    if (navigate) navigate(step.path);
  },

  nextStep: () => {
    const state = get();
    const currentIndex = ALL_STEPS.findIndex(s => s.number === state.currentStep.number);
    const nextIndex = currentIndex + 1;

    if (nextIndex < ALL_STEPS.length) {
      const nextStep = ALL_STEPS[nextIndex];
      set({ currentStep: nextStep });
      if (state.navigate) state.navigate(nextStep.path);
    }
  },

  prevStep: () => {
    const state = get();
    const currentIndex = ALL_STEPS.findIndex(s => s.number === state.currentStep.number);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevStep = ALL_STEPS[prevIndex];
      set({ currentStep: prevStep });
      if (state.navigate) state.navigate(prevStep.path);
    }
  },

  resetStep: () => {
    set({ currentStep: ALL_STEPS[0] });
    const { navigate } = get();
    if (navigate) navigate(ALL_STEPS[0].path);
  },
}));
