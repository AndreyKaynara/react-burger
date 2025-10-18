import { API_SERVER_URL } from './api';

function checkResponse(res) {
  if (!res.ok) {
    throw new Error('Ошибка сервера');
  }
  return res.json();
}

export default function request(endpoint, options) {
  const url = `${API_SERVER_URL}/${endpoint}`;
  return fetch(url, options)
    .then(checkResponse)
    .catch((error) => {
      console.log('Ошибка запроса:', error);
      throw error;
    });
}
