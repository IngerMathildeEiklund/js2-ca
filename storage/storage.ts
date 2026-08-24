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
};

// --- Usage Example ---

/* interface UserProfile {
  name: string;
}

// After login
const userData = { name: 'testuser', accessToken: '...' };

storage.save('accessToken', userData.accessToken);
storage.save<UserProfile>('profile', { name: userData.name });

// Later, on another page
const profile = storage.load<UserProfile>('profile');

if (profile) {
  console.log(`Welcome back, ${profile.name}!`);
} */