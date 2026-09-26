import type { UserProfile } from "../api/authService";

export const storage = {
  save<T>(key: string, value: T): void {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  },

  load<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing storage key "${key}":`, error);
      return null;
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }
};

export function getLoggedInUser(): UserProfile | null {
  return storage.load<UserProfile>("profile");
}

export function requireLogin(): void {
  const profile = storage.load<UserProfile>("profile");
  const accessToken = storage.load("accessToken");
  const isLoggedIn = !!profile && !!accessToken;

  const onLoginPage = window.location.pathname.endsWith("login.html");

  if (!isLoggedIn && !onLoginPage) {
    window.location.href = "./login.html";
  }
}
