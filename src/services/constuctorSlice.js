import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  fillings: [],
  totalPrice: 0,
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action) => {
        // Булочка считается в двух экземплярах.
        if (action.payload.type === 'bun') {
          if (state.bun) {
            state.totalPrice -= state.bun.price * 2;
          }
          state.bun = action.payload;
          state.totalPrice += action.payload.price * 2;
          return;
        }
        state.fillings.push(action.payload);
        state.totalPrice += action.payload.price;
      },
      prepare: (ingredient) => {
        return { payload: { ...ingredient, uuid: nanoid() } };
      },
    },
    removeIngredient: (state, action) => {
      // Обрабатываем булочку отдельно, так как сумму денег нужно дважды удалить.
      if (action.payload.type === 'bun') {
        if (state.bun && state.bun._id === action.payload._id) {
          state.bun = null;
          state.totalPrice -= action.payload.price * 2;
        }
        return;
      }

      const ingredientIndex = state.fillings.findIndex((ingredient) => ingredient.uuid === action.payload.uuid);
      if (ingredientIndex !== -1) {
        state.fillings.splice(ingredientIndex, 1);
        state.totalPrice -= action.payload.price;
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.fillings = [];
      state.totalPrice = 0;
    },
    reorderIngredients: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.fillings.splice(fromIndex, 1);
      state.fillings.splice(toIndex, 0, movedItem);
    },
  },
});

export const { addIngredient, removeIngredient, clearConstructor, reorderIngredients } = constructorSlice.actions;
export default constructorSlice.reducer;
