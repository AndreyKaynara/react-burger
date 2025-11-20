import request from '../utils/requests';
import type { CreateOrderApiResponse, Order } from '../types';

export const createOrderApi = async (orderData: string[]): Promise<Order> => {
  const data = await request<CreateOrderApiResponse>('orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: orderData }),
  });
  if (!data.success) {
    throw new Error(data.message || 'Не удалось создать заказ');
  }
  return data.order;
};
