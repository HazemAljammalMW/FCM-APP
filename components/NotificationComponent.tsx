'use client'
import React, { useEffect, useState } from 'react';
import useFirebaseMessaging from '../hooks/useFirebaseMessaging';
import { INotification } from '../types/notification';

// Updated Toast component with image support
interface ToastProps {
  title?: string;
  message?: string;
  image?: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, message, image, onClose }) => (
  <div className="toast" style={{ 
    position: 'fixed', 
    top: '20px', 
    right: '20px', 
    backgroundColor: '#333',
    color: 'white',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    zIndex: 1000,
    maxWidth: '300px'
  }}>
    <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', color: 'white' }}>×</button>
    {title && <h4>{title}</h4>}
    {image && (
      <img 
        src={image} 
        alt="Notification image" 
        style={{ width: '100%', height: 'auto', marginBottom: '10px' }} 
      />
    )}
    {message && <p>{message}</p>}
  </div>
);

const NotificationComponent: React.FC = () => {
  const { notification, fcmToken, isTokenFound } = useFirebaseMessaging();
  const [localNotification, setLocalNotification] = useState<INotification | null>(null);

  useEffect(() => {
    if (notification) {
      setLocalNotification(notification);
    }
  }, [notification]);

  useEffect(() => {
    if (isTokenFound) {
      // You can save this token to your database
      console.log('FCM Token found:', fcmToken);
    }
  }, [isTokenFound, fcmToken]);

  if (!localNotification) return null;

  return (
    <Toast
      title={localNotification.title}
      message={localNotification.body}
      image={localNotification.image} // Pass the image URL
      onClose={() => setLocalNotification(null)}
    />
  );
};

export default NotificationComponent;
