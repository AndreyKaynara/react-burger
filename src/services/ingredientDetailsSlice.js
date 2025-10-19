import { createSlice } from '@reduxjs/toolkit';

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState: {
    ingredient: null,
  },
  reducers: {
    setIngredient: (state, action) => {
      state.ingredient = action.payload;
    },

    clearIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setIngredient, clearIngredient } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
