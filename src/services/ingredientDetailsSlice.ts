import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient, IngredientDetailsState } from '../types';

export const initialState: IngredientDetailsState = {
  ingredient: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.ingredient = action.payload;
    },

    clearIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setIngredient, clearIngredient } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
