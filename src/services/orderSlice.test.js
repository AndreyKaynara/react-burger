import reducer, { clearOrder } from './orderSlice';
import { createOrder } from './orderSlice';

const initial = { data: null, status: 'idle', error: null };

const order = {
  number: 1234,
  name: 'Space Burger',
  ingredients: ['a', 'b'],
  _id: 'ord1',
  status: 'done',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('orderSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initial);
  });

  it('clearOrder сбрасывает состояние к начальному', () => {
    const prev = { data: order, status: 'succeeded', error: null };
    expect(reducer(prev, clearOrder())).toEqual(initial);
  });

  it('обрабатывает createOrder.pending', () => {
    const next = reducer(initial, createOrder.pending('x', []));
    expect(next.status).toBe('loading');
    expect(next.error).toBe(null);
  });

  it('обрабатывает createOrder.fulfilled', () => {
    const next = reducer(initial, createOrder.fulfilled(order, 'x', []));
    expect(next.status).toBe('succeeded');
    expect(next.data).toEqual(order);
  });

  it('обрабатывает createOrder.rejected', () => {
    const action = createOrder.rejected(new Error('Fail'), 'x', []);
    const next = reducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Fail');
  });
});
