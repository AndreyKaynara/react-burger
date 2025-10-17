import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { API_SERVER_URL } from '../utils/api';

export const createOrder = createAsyncThunk('constructor/createOrder', async (orderData) => {
  const response = await fetch(`${API_SERVER_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: orderData }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при формировании заказа');
  }

  const data = await response.json();
  return data.order;
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
