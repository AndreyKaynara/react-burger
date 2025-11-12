import request from '../requests';

export const getIngredientsApi = async () => {
  const data = await request('ingredients');
  return data.data;
};
