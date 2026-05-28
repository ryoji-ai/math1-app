"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppState, ProgressEntry } from "./types";

const STORAGE_KEY = "math1-app-state-v1";

const defaultState: AppState = {
  progress: {},
  streakDays: 0,
  lastStudyDate: null,
};

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      progress: parsed.progress ?? {},
    };
  } catch {
    return defaultState;
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

function recordOnState(
  state: AppState,
  groupId: string,
  correct: boolean,
): AppState {
  const today = todayIsoDate();
  const prev: ProgressEntry =
    state.progress[groupId] ?? {
      attempts: 0,
      correct: 0,
      lastAnsweredAt: today,
      recentResults: [],
    };
  const updated: ProgressEntry = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (correct ? 1 : 0),
    lastAnsweredAt: today,
    recentResults: [...prev.recentResults, correct].slice(-10),
  };

  let streakDays = state.streakDays;
  let lastStudyDate = state.lastStudyDate;
  if (lastStudyDate !== today) {
    if (lastStudyDate) {
      const d = diffDays(lastStudyDate, today);
      streakDays = d === 1 ? streakDays + 1 : 1;
    } else {
      streakDays = 1;
    }
    lastStudyDate = today;
  }

  return {
    ...state,
    progress: { ...state.progress, [groupId]: updated },
    streakDays,
    lastStudyDate,
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const recordResult = useCallback((groupId: string, correct: boolean) => {
    setState((s) => {
      const next = recordOnState(s, groupId, correct);
      saveState(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState((s) => {
      const next = { ...s, progress: {}, streakDays: 0, lastStudyDate: null };
      saveState(next);
      return next;
    });
  }, []);

  return { state, hydrated, recordResult, resetProgress };
}

export function isWeak(entry: ProgressEntry | undefined): boolean {
  if (!entry || entry.recentResults.length < 5) return false;
  const recent =
    entry.recentResults.filter(Boolean).length / entry.recentResults.length;
  return recent < 0.6;
}
