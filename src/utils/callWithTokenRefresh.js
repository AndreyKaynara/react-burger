import { getCookie, setCookie, deleteCookie } from './cookies';
import { refreshTokenApi } from './api/authApi';

const isTokenError = (error) =>
  // API отвечает именно 403, не 401. Но при обновлении токена уже 401.
  error.status === 403 && /jwt|expired|invalid/i.test(error.message);

export const callWithTokenRefresh = async (apiCall) => {
  const accessToken = getCookie('accessToken');
  const refreshTokenValue = getCookie('refreshToken');

  if (!accessToken || !refreshTokenValue) {
    throw new Error('Нет токенов');
  }

  try {
    // Первая попытка с текущим токеном.
    return await apiCall(accessToken);
  } catch (error) {
    // Проверяем, что ошибка именно из-за токена.
    if (!isTokenError(error)) {
      throw error;
    }

    // Пытаемся обновить токен только для ошибок авторизации.
    try {
      const newTokenData = await refreshTokenApi(refreshTokenValue);

      setCookie('accessToken', newTokenData.accessToken);
      setCookie('refreshToken', newTokenData.refreshToken);

      // Повторный запрос с новым токеном.
      return await apiCall(newTokenData.accessToken);
    } catch (refreshError) {
      // Если обновление не удалось, очищаем токены.
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      throw refreshError;
    }
  }
};
