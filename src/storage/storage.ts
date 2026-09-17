import type { UserProfile } from "../api/authService";

export const storage = {
  save<T>(key: string, value: T): void {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  },

  load<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing storage key "${key}":`, error);
      return null;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}


export function getLoggedInUser(): UserProfile | null {
  return storage.load<UserProfile>('profile');
}

