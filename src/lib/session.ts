export type AuthRole = "admin" | "alumni";

export type AuthSession = {
  userId: string;
  role: AuthRole;
  approved: boolean;
  createdAt: number;
  expiresAt: number;
  lastActivityAt: number;
};

const STORAGE_KEY = "sacred-auth-session";
const FIREBASE_USER_KEY = "firebase-user";
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const session = JSON.parse(stored) as AuthSession;
    return session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}

export function isAuthSessionValid(session: AuthSession | null, requiredRole?: AuthRole) {
  if (!session) {
    return false;
  }

  const now = Date.now();
  if (now > session.expiresAt) {
    return false;
  }

  if (requiredRole && session.role !== requiredRole) {
    return false;
  }

  return true;
}

export function createAuthSession(data: {
  userId: string;
  role: AuthRole;
  approved: boolean;
}) {
  const now = Date.now();
  const session: AuthSession = {
    userId: data.userId,
    role: data.role,
    approved: data.approved,
    createdAt: now,
    lastActivityAt: now,
    expiresAt: now + INACTIVITY_TIMEOUT_MS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function refreshAuthSessionActivity() {
  const session = getAuthSession();
  if (!session) {
    return null;
  }

  if (!isAuthSessionValid(session)) {
    clearAuthSession();
    return null;
  }

  const now = Date.now();
  const updated: AuthSession = {
    ...session,
    lastActivityAt: now,
    expiresAt: now + INACTIVITY_TIMEOUT_MS,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function logout() {
  clearAuthSession();
  clearFirebaseUser();
}

// Firebase user storage
export type FirebaseUserData = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
};

export function setFirebaseUser(user: FirebaseUserData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FIREBASE_USER_KEY, JSON.stringify(user));
}

export function getFirebaseUser(): FirebaseUserData | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(FIREBASE_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as FirebaseUserData;
  } catch {
    localStorage.removeItem(FIREBASE_USER_KEY);
    return null;
  }
}

export function clearFirebaseUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FIREBASE_USER_KEY);
}
