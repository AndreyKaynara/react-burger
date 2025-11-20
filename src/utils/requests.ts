import { API_SERVER_URL } from '../api/api';

interface ApiError extends Error {
  status: number;
}

async function checkResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Ошибка сервера') as ApiError;
    error.status = res.status;
    throw error;
  }
  return data;
}

export default function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_SERVER_URL}/${endpoint}`;
  return fetch(url, options)
    .then(checkResponse<T>)
    .catch((error: ApiError) => {
      throw error;
    });
}
