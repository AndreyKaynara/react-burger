import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrderApi } from '../utils/api/ordersApi';

export const createOrder = createAsyncThunk('constructor/createOrder', async (orderData, { rejectWithValue }) => {
  return await createOrderApi(orderData);
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
