'use client';

import { useEffect, useState } from 'react';
import { initializePushNotifications, subscribeToPushNotifications, isSubscribedToPush } from '@/lib/pushNotifications';
import { auth } from '@/lib/auth';

export function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if user is authenticated
        const user = auth.getUser();
        if (!user) {
          return;
        }

        // Check if browser supports push notifications
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          console.log('[PushNotifications] Browser does not support push notifications');
          return;
        }

        // Initialize push notifications
        await initializePushNotifications();
        setIsInitialized(true);
      } catch (error) {
        console.error('[PushNotifications] Error initializing:', error);
      }
    };

    init();
  }, []);

  return <>{children}</>;
}

