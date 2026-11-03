"use client";

import { useSyncExternalStore } from "react";

// A tiny localStorage-backed store shared by every component that uses it.
// All hook instances read the same cached value and re-render together when
// it changes (including changes made in another browser tab).
export interface LocalStore<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  getServerSnapshot: () => T;
}

export function createLocalStore<T>(
  key: string,
  fallback: T,
  parse: (raw: unknown) => T = (raw) => raw as T
): LocalStore<T> {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function get(): T {
    if (typeof window === "undefined") return fallback;
    if (cache === undefined) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) {
          cache = fallback;
        } else {
          let value: unknown;
          try {
            value = JSON.parse(raw);
          } catch {
            value = raw; // older versions stored some values as plain strings
          }
          cache = parse(value);
        }
      } catch {
        cache = fallback;
      }
    }
    return cache;
  }

  function set(next: T | ((prev: T) => T)) {
    const value = typeof next === "function" ? (next as (prev: T) => T)(get()) : next;
    if (value === cache) return;
    cache = value;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked — keep the in-memory value.
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      cache = undefined;
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { get, set, subscribe, getServerSnapshot: () => fallback };
}

export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServerSnapshot);
}

// Treats anything that isn't a plain object as empty, for use in parse functions.
export function asObject<T>(raw: unknown): Partial<T> {
  return raw !== null && typeof raw === "object" && !Array.isArray(raw) ? (raw as Partial<T>) : {};
}

const noopSubscribe = () => () => {};

// false during server render and hydration, true afterwards.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
