import reducer, { clearOrder, initialState } from './orderSlice';
import { createOrder } from './orderSlice';

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
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('clearOrder сбрасывает состояние к начальному', () => {
    const prev = { data: order, status: 'succeeded', error: null };
    expect(reducer(prev, clearOrder())).toEqual(initialState);
  });

  it('обрабатывает createOrder.pending', () => {
    const next = reducer(initialState, createOrder.pending('x', []));
    expect(next.status).toBe('loading');
    expect(next.error).toBe(null);
  });

  it('обрабатывает createOrder.fulfilled', () => {
    const next = reducer(initialState, createOrder.fulfilled(order, 'x', []));
    expect(next.status).toBe('succeeded');
    expect(next.data).toEqual(order);
  });

  it('обрабатывает createOrder.rejected', () => {
    const action = createOrder.rejected(new Error('Fail'), 'x', []);
    const next = reducer(initialState, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Fail');
  });
});
