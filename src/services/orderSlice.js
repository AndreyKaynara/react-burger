import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import request from '../utils/requests';

export const createOrder = createAsyncThunk('constructor/createOrder', async (orderData) => {
  const data = await request('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: orderData }),
  });
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
