const API_SERVER_URL = 'https://norma.nomoreparties.space/api';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

export const getIngredients = async () => {
  const res = await fetch(`${API_SERVER_URL}/ingredients`);
  const data = await checkResponse(res);
  if (data.success) {
    return data.data;
  }
  return Promise.reject('Ошибка сервера API');
};
