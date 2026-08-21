export const HOME_INTRO_STORAGE_KEY = "grok-home-intro-v1";

export function hasSeenHomeIntro(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(HOME_INTRO_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markHomeIntroSeen(): void {
  try {
    localStorage.setItem(HOME_INTRO_STORAGE_KEY, "1");
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}
