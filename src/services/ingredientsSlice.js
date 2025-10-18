import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import request from '../utils/requests';

export const fetchIngredients = createAsyncThunk('ingredients/fetchIngredients', async () => {
  const data = await request('ingredients');
  return data.data;
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    data: [],
    counters: {},
    status: 'idle',
    error: null,
  },
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
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.counters = state.data.reduce((acc, item) => {
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
