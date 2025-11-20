import request from '../utils/requests';
import type { IngredientsApiResponse, Ingredient } from '../types';

export const getIngredientsApi = async (): Promise<Ingredient[]> => {
  const data = await request<IngredientsApiResponse>('ingredients');
  if (!data.success) {
    throw new Error(data.message || 'Не удалось получить ингредиенты');
  }
  return data.data;
};
