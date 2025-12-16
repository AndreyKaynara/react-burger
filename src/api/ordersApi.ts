import request from '../utils/requests';
import { callWithTokenRefresh } from '../utils/callWithTokenRefresh';
import type { CreateOrderApiResponse } from '../types';
import type { Order, OrderFromFeed } from '../types/entities';

export const createOrderApi = async (orderData: string[]): Promise<Order> => {
  const data = await callWithTokenRefresh((token) =>
    request<CreateOrderApiResponse>('orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({ ingredients: orderData }),
    })
  );
  if (!data.success) {
    throw new Error(data.message || 'Не удалось создать заказ');
  }
  return data.order;
};

type GetOrderByNumberResponse = {
  success: boolean;
  orders: OrderFromFeed[];
};

export const getOrderByNumber = async (number: number): Promise<OrderFromFeed | null> => {
  const data = await request<GetOrderByNumberResponse>(`orders/${number}`);
  if (!data.success || !data.orders || data.orders.length === 0) {
    return null;
  }
  return data.orders[0];
};
