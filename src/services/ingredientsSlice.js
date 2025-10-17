import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { API_SERVER_URL } from '../utils/api';

export const fetchIngredients = createAsyncThunk('ingredients/fetchIngredients', async () => {
  const response = await fetch(`${API_SERVER_URL}/ingredients`);

  if (!response.ok) {
    throw new Error('Ошибка загрузки ингредиентов');
  }

  const data = await response.json();
  return data.data;
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
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
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ingredientsSlice.reducer;
