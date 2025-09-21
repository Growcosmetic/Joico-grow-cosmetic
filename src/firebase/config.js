import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC68i_HdkNj0Fw0vs2lJPeijOuU0OyerFI",
  authDomain: "joico-defy-damage.firebaseapp.com",
  projectId: "joico-defy-damage",
  storageBucket: "joico-defy-damage.firebasestorage.app",
  messagingSenderId: "206123068003",
  appId: "1:206123068003:web:eacf9c43bd49fc3b352656",
  measurementId: "G-3X6L99WBYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;
