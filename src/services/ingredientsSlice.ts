import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../api/ingredientsApi';
import { Ingredient, IngredientsState } from '../types';

export const fetchIngredients = createAsyncThunk('ingredients/fetchIngredients', getIngredientsApi);

export const initialState: IngredientsState = {
  data: [],
  counters: {},
  status: 'idle',
  error: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    incrementCounter: (state, action) => {
      state.counters[action.payload] = state.counters[action.payload] + 1;
    },
    decrementCounter: (state, action) => {
      const current = state.counters[action.payload];
      state.counters[action.payload] = current > 0 ? current - 1 : 0;
    },

    resetCounters: (state) => {
      state.data.forEach((item) => {
        state.counters[item._id] = 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<Ingredient[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.counters = state.data.reduce<Record<string, number>>((acc, item) => {
          acc[item._id] = 0;
          return acc;
        }, {});
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { incrementCounter, decrementCounter, resetCounters } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
