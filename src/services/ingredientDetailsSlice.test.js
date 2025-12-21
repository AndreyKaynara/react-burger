import reducer, { setIngredient, clearIngredient } from './ingredientDetailsSlice';

describe('ingredientDetailsSlice reducer', () => {
  it('возвращает начальное состояние при неизвестном действии', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ ingredient: null });
  });

  it('обрабатывает setIngredient', () => {
    const prevState = { ingredient: null };
    const mockIngredient = {
      _id: '123',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3/bun.png',
      image_mobile: 'https://code.s3/bun-mobile.png',
      image_large: 'https://code.s3/bun-large.png',
      __v: 0,
    };

    const nextState = reducer(prevState, setIngredient(mockIngredient));
    expect(nextState).toEqual({ ingredient: mockIngredient });
  });

  it('обрабатывает clearIngredient', () => {
    const prevState = {
      ingredient: {
        _id: '123',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3/bun.png',
        image_mobile: 'https://code.s3/bun-mobile.png',
        image_large: 'https://code.s3/bun-large.png',
        __v: 0,
      },
    };

    const nextState = reducer(prevState, clearIngredient());
    expect(nextState).toEqual({ ingredient: null });
  });
});
