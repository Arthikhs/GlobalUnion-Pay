import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/store';
import { useNotifStore } from '../store/store';

export const useWebSocket = () => {
  const clientRef = useRef<Client | null>(null);
  const { user, accessToken } = useAuthStore();
  const { addNotification } = useNotifStore();

  useEffect(() => {
    if (!user || !accessToken) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8087/ws'),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        client.subscribe(`/user/${user.id}/queue/notifications`, (message) => {
          const n = JSON.parse(message.body);
          if (n.type === 'PAYMENT_SENT') {
            toast.success(n.title, { duration: 5000 });
            addNotification({ icon: '💸', title: n.title });
          } else if (n.type === 'PAYMENT_RECEIVED') {
            toast.success(n.title, { duration: 5000, icon: '💰' });
            addNotification({ icon: '💰', title: n.title });
          }
        });
        client.subscribe('/topic/payment-failed', (message) => {
          const data = JSON.parse(message.body);
          toast.error(`Payment Failed: ${data.reason}`, { duration: 5000 });
          addNotification({ icon: '❌', title: `Payment Failed: ${data.reason}` });
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

// Call this from anywhere after a transaction to push a local notification
export function pushNotification(icon: string, title: string) {
  useNotifStore.getState().addNotification({ icon, title });
}
