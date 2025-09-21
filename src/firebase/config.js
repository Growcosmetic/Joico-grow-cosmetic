import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvOkBwGyRLnAI2Q2Q0dQwXQwXQwXQwXQw", // Replace with your actual API key
  authDomain: "joico-defy-damage.firebaseapp.com",
  projectId: "joico-defy-damage",
  storageBucket: "joico-defy-damage.firebasestorage.app",
  messagingSenderId: "123456789012", // Replace with your actual sender ID
  appId: "1:123456789012:web:abcdefghijklmnop" // Replace with your actual app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
