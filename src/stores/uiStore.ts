import { writable, type Writable } from "svelte/store";
import { type UIState } from "../lib/types/panel";

export const uiStore: Writable<UIState> = writable({
  isLoading: false,
  error: null,
  currentStep: "upload",
  showCropModal: false,
  showTextManager: false,
});

export const setLoading = (loading: boolean): void => {
  uiStore.update((state) => ({ ...state, isLoading: loading }));
};

export const setError = (error: string | null): void => {
  uiStore.update((state) => ({ ...state, error }));
};

export const clearError = (): void => {
  setError(null);
};

export const setCurrentStep = (step: UIState["currentStep"]): void => {
  uiStore.update((state) => ({ ...state, currentStep: step }));
};

export const showCropModal = (show: boolean): void => {
  uiStore.update((state) => ({ ...state, showCropModal: show }));
};

export const showTextManager = (show: boolean): void => {
  uiStore.update((state) => ({ ...state, showTextManager: show }));
};

export const resetUI = (): void => {
  uiStore.set({
    isLoading: false,
    error: null,
    currentStep: "upload",
    showCropModal: false,
    showTextManager: false,
  });
};
