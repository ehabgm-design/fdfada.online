import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
// We can add scopes if needed, but basic email/profile are default.
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
