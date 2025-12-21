import reducer, { addIngredient, removeIngredient, clearConstructor, reorderIngredients } from './constuctorSlice';

const bun = {
  _id: 'bun1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'i',
  image_mobile: 'im',
  image_large: 'il',
  __v: 0,
};

const filling = {
  _id: 'fill1',
  name: 'Котлета',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 200,
  price: 80,
  image: 'i',
  image_mobile: 'im',
  image_large: 'il',
  __v: 0,
};

const initial = { bun: null, fillings: [], totalPrice: 0 };

describe('constructorSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initial);
  });

  it('addIngredient добавляет булку и считает итоговую цену x2, заменяя предыдущую булку', () => {
    let state = reducer(initial, addIngredient(bun));
    expect(state.bun?.type).toBe('bun');
    expect(state.totalPrice).toBe(bun.price * 2);

    const bun2 = { ...bun, _id: 'bun2', price: 70 };
    state = reducer(state, addIngredient(bun2));
    expect(state.bun?._id).toBe('bun2');
    expect(state.totalPrice).toBe(bun2.price * 2);
  });

  it('addIngredient добавляет начинку и обновляет итоговую цену', () => {
    const state = reducer(initial, addIngredient(filling));
    expect(state.fillings.length).toBe(1);
    expect(state.fillings[0]).toHaveProperty('uuid');
    expect(state.totalPrice).toBe(filling.price);
  });

  it('removeIngredient удаляет булку и вычитает цену x2', () => {
    let state = reducer(initial, addIngredient(bun));
    const prevPrice = state.totalPrice;
    // remove by passing bun payload
    state = reducer(state, removeIngredient(state.bun));
    expect(state.bun).toBeNull();
    expect(state.totalPrice).toBe(prevPrice - bun.price * 2);
  });

  it('removeIngredient удаляет конкретную начинку по uuid и вычитает её цену', () => {
    let state = reducer(initial, addIngredient(filling));
    const fillingWithUuid = state.fillings[0];
    const prevPrice = state.totalPrice;
    state = reducer(state, removeIngredient(fillingWithUuid));
    expect(state.fillings.length).toBe(0);
    expect(state.totalPrice).toBe(prevPrice - filling.price);
  });

  it('clearConstructor сбрасывает состояние к начальному', () => {
    let state = reducer(initial, addIngredient(bun));
    state = reducer(state, addIngredient(filling));
    state = reducer(state, clearConstructor());
    expect(state).toEqual(initial);
  });

  it('reorderIngredients перемещает элемент внутри начинки', () => {
    // add two fillings
    let state = reducer(initial, addIngredient({ ...filling, _id: 'f1', price: 10 }));
    state = reducer(state, addIngredient({ ...filling, _id: 'f2', price: 20 }));
    const first = state.fillings[0];
    const second = state.fillings[1];
    state = reducer(state, reorderIngredients({ fromIndex: 0, toIndex: 1 }));
    expect(state.fillings[0]).toEqual(second);
    expect(state.fillings[1]).toEqual(first);
  });
});
