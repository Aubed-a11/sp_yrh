// src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useMatchWebSocket(matchId, onEvent) {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!matchId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to match events
        client.subscribe(`/topic/match/${matchId}`, (msg) => {
          const data = JSON.parse(msg.body);
          onEvent(data);
        });
        client.subscribe(`/topic/match/${matchId}/events`, (msg) => {
          const data = JSON.parse(msg.body);
          onEvent({ ...data, isEvent: true });
        });
      },
      onDisconnect: () => console.log('WS disconnected'),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [matchId]);

  const sendEvent = useCallback((eventData) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/match.event',
        body: JSON.stringify(eventData),
      });
    }
  }, []);

  return { sendEvent };
}
