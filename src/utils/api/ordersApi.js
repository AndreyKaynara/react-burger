import request from '../requests';

export const createOrderApi = async (orderData) => {
  const data = await request('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: orderData }),
  });
  return data.order;
};
