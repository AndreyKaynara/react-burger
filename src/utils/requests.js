import { API_SERVER_URL } from './api/api';

async function checkResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Ошибка сервера');
    error.status = res.status;
    throw error;
  }
  return data;
}
export default function request(endpoint, options) {
  const url = `${API_SERVER_URL}/${endpoint}`;
  return fetch(url, options)
    .then(checkResponse)
    .catch((error) => {
      throw error;
    });
}
