import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../../firebase";

const googleProvider = new GoogleAuthProvider();
// Add this to prevent the COOP issue
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<{ user: FirebaseUser; idToken: string }> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();
  return {
    user: mapFirebaseUser(result.user),
    idToken,
  };
}

export async function registerWithEmailPassword(
  email: string,
  password: string,
  displayName: string
): Promise<{ user: FirebaseUser; idToken: string }> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  const idToken = await result.user.getIdToken();
  return {
    user: mapFirebaseUser(result.user),
    idToken,
  };
}

export async function loginWithGoogle(): Promise<{
  user: FirebaseUser;
  idToken: string;
}> {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return {
    user: mapFirebaseUser(result.user),
    idToken,
  };
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

export async function getCurrentUser(): Promise<FirebaseUser | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return mapFirebaseUser(user);
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function resetPassword(email: string): Promise<void> {
  // Configure the continue URL - where Firebase redirects after clicking the reset link
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/login?passwordReset=true`,
  };
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
}

export async function confirmResetPassword(oobCode: string, newPassword: string): Promise<void> {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

function mapFirebaseUser(user: User): FirebaseUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerId: user.providerId,
  };
}