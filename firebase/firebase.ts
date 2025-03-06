import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase // i get it bro
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
// Get messaging instance - null on server-side // dont get it bro
export const messaging: Messaging | null = typeof window !== 'undefined' ? getMessaging(firebaseApp) : null;

// Request permission and get FCM token // i dont get it bro
// export const requestNotificationPermission = async (): Promise<string | null> => {
//   try {
//     if (!messaging) return null;
    
//     const permission = await Notification.requestPermission();
//     if (permission !== 'granted') {
//       console.log('Notification permission denied');
//       return null;
//     }

//     // Get token
//     const token = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
//     });
    
//     return token;
//   } catch (error) {
//     console.error('An error occurred while retrieving token:', error);
//     return null;
//   }
// };

// // Handle foreground messages
// export const onMessageListener = (): Promise<MessagePayload | null> => {
//   return new Promise((resolve) => {
//     if (!messaging) return resolve(null);
    
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
// };