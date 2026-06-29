import { createInitialState } from "./state.js";

const STORAGE_KEY = "study_farm_kiwi_v1";

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return createInitialState();

  try {
    return JSON.parse(raw);
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
