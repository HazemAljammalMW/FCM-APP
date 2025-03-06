import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../firebase/firebase';
import { INotification } from '../types/notification';
import { storeDeviceFCM } from '@/firebase/campaign';

interface UseFirebaseMessagingReturn {
  fcmToken: string;
  notification: INotification | null;
  isTokenFound: boolean;
}

export default function useFirebaseMessaging(): UseFirebaseMessagingReturn {
  const [fcmToken, setFcmToken] = useState<string>('');
  const [notification, setNotification] = useState<INotification | null>(null);
  const [isTokenFound, setIsTokenFound] = useState<boolean>(false);

  useEffect(() => {
    const getFcmToken = async (): Promise<void> => {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        setIsTokenFound(true);
        
        // Here you would typically send this token to your backend
        console.log('FCM token:', token);
        storeDeviceFCM(token);
      }
    };

    getFcmToken();
  }, []);

  useEffect(() => {
    const unsubscribe = onMessageListener().then(payload => {
      console.log('Received foreground message:', payload);
      if (payload) {
        const { title, body } = payload.notification || {};
          const image = payload.notification?.image;
        setNotification({
          title: title,
          body: body,
          image:image
        });
        
      }
    });

    // Return type is Promise, so we handle it differently
    return () => {
      unsubscribe.catch(err => console.error('Failed to unsubscribe from FCM:', err));
    };
  }, []);

  return { fcmToken, notification, isTokenFound };
}