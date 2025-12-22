import reducer, { incrementCounter, decrementCounter, resetCounters, initialState } from './ingredientsSlice';
import { fetchIngredients } from './ingredientsSlice';

const makeIngredient = (over = {}) => ({
  _id: 'ing1',
  name: 'Соус фирменный',
  type: 'sauce',
  proteins: 10,
  fat: 5,
  carbohydrates: 3,
  calories: 50,
  price: 100,
  image: 'img',
  image_mobile: 'img_m',
  image_large: 'img_l',
  __v: 0,
  ...over,
});

describe('ingredientsSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('incrementCounter увеличивает счётчик', () => {
    const state = {
      data: [makeIngredient({ _id: 'a' })],
      counters: { a: 0 },
      status: 'idle',
      error: null,
    };
    const next = reducer(state, incrementCounter('a'));
    expect(next.counters.a).toBe(1);
  });

  it('decrementCounter уменьшает счётчик, но не ниже нуля', () => {
    const s1 = reducer(
      { data: [], counters: { a: 1 }, status: 'idle', error: null },
      decrementCounter('a')
    );
    expect(s1.counters.a).toBe(0);

    const s2 = reducer(
      { data: [], counters: { a: 0 }, status: 'idle', error: null },
      decrementCounter('a')
    );
    expect(s2.counters.a).toBe(0);
  });

  it('resetCounters устанавливает все счётчики в 0 для существующих данных', () => {
    const data = [makeIngredient({ _id: 'a' }), makeIngredient({ _id: 'b' })];
    const state = { data, counters: { a: 3, b: 5 }, status: 'idle', error: null };
    const next = reducer(state, resetCounters());
    expect(next.counters).toEqual({ a: 0, b: 0 });
  });

  it('обрабатывает fetchIngredients.pending', () => {
    const next = reducer(undefined, fetchIngredients.pending('req1'));
    expect(next.status).toBe('loading');
    expect(next.error).toBeNull();
  });

  it('обрабатывает fetchIngredients.fulfilled', () => {
    const payload = [makeIngredient({ _id: 'a' }), makeIngredient({ _id: 'b' })];
    const next = reducer(
      { data: [], counters: {}, status: 'idle', error: null },
      fetchIngredients.fulfilled(payload, 'req1', undefined)
    );
    expect(next.status).toBe('succeeded');
    expect(next.data).toEqual(payload);
    expect(next.counters).toEqual({ a: 0, b: 0 });
  });

  it('обрабатывает fetchIngredients.rejected', () => {
    const error = new Error('Network');
    const action = fetchIngredients.rejected(error, 'req1');
    const next = reducer(undefined, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Network');
  });
});
