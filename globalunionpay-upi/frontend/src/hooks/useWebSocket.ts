import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/store';

export const useWebSocket = () => {
  const clientRef = useRef<Client | null>(null);
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!user || !accessToken) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8087/ws'),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        // Subscribe to personal notifications
        client.subscribe(`/user/${user.id}/queue/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          if (notification.type === 'PAYMENT_SENT') {
            toast.success(notification.title, { duration: 5000 });
          } else if (notification.type === 'PAYMENT_RECEIVED') {
            toast.success(notification.title, {
              duration: 5000,
              icon: '💰',
            });
          }
        });

        // Subscribe to broadcast payment failures
        client.subscribe('/topic/payment-failed', (message) => {
          const data = JSON.parse(message.body);
          toast.error(`Payment Failed: ${data.reason}`, { duration: 5000 });
        });
      },
      onDisconnect: () => console.log('WebSocket disconnected'),
      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [user, accessToken]);

  return clientRef;
};
