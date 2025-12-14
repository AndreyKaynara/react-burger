import { Middleware } from '@reduxjs/toolkit';
import { getCookie, setCookie, deleteCookie } from '../utils/cookies';
import { refreshTokenApi } from '../api/authApi';

export interface WsActions {
  connect: string;
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
}

export const createWebSocketMiddleware = (
  wsUrl: string,
  wsActions: WsActions,
  withTokenRefresh: boolean = false
): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let url = wsUrl;

    const connect = () => {
      if (socket?.readyState === WebSocket.OPEN) {
        return;
      }

      // Добавляем токен если требуется
      if (withTokenRefresh) {
        const token = getCookie('accessToken')?.replace('Bearer ', '');
        url = token ? `${wsUrl}?token=${token}` : wsUrl;
      }

      socket = new WebSocket(url);

      socket.onopen = () => {
        console.log('WebSocket connected');
        store.dispatch({ type: wsActions.onOpen });
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        store.dispatch({ type: wsActions.onError, payload: 'WebSocket error occurred' });
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event);
        store.dispatch({ type: wsActions.onClose });

        // Переподключение через 3 секунды
        if (event.code !== 1000) {
          reconnectTimer = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, 3000);
        }
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          // Обработка просроченного/отсутствующего токена
          if (withTokenRefresh && data && data.message === 'Invalid or missing token') {
            try {
              const refreshToken = getCookie('refreshToken');
              if (!refreshToken) {
                // Нет рефреша — чистим и отключаемся
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                store.dispatch({ type: wsActions.onError, payload: 'Требуется авторизация' });
                socket?.close(1000, 'Auth required');
                return;
              }

              const result = await refreshTokenApi(refreshToken);
              if (result.success) {
                setCookie('accessToken', result.accessToken);
                setCookie('refreshToken', result.refreshToken);

                // Переподключаемся с новым токеном
                const token = result.accessToken.replace('Bearer ', '');
                url = `${wsUrl}?token=${token}`;
                socket?.close(1000, 'Refreshing token');
                // Немного подождать, затем переподключиться
                setTimeout(() => connect(), 100);
                return;
              }

              // Не удалось обновить токен
              deleteCookie('accessToken');
              deleteCookie('refreshToken');
              store.dispatch({ type: wsActions.onError, payload: result.message || 'Не удалось обновить токен' });
              socket?.close(1000, 'Token refresh failed');
              return;
            } catch (e: any) {
              deleteCookie('accessToken');
              deleteCookie('refreshToken');
              store.dispatch({ type: wsActions.onError, payload: e?.message || 'Ошибка обновления токена' });
              socket?.close(1000, 'Token refresh exception');
              return;
            }
          }

          store.dispatch({ type: wsActions.onMessage, payload: data });
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    };

    const disconnect = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      if (socket) {
        socket.close(1000, 'Client disconnect');
        socket = null;
      }
    };

    return (next) => (action: any) => {
      const { type } = action;

      if (type === wsActions.connect) {
        connect();
      } else if (type === wsActions.disconnect) {
        disconnect();
      }

      return next(action);
    };
  };
};
