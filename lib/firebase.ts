// lib/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUoRdci5djYHuLAWePLa2c2q-yAcJhtL0",
  authDomain: "sample-a0ce6.firebaseapp.com",
  projectId: "sample-a0ce6",
  storageBucket: "sample-a0ce6.firebasestorage.app",
  messagingSenderId: "1050105410811",
  appId: "1:1050105410811:web:6a4c652fc50d1bd9f8ec5e",
  measurementId: "G-6M2CME33BY"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Analytics only in the client-side
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
