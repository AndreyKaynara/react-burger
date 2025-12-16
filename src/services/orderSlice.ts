import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createOrderApi } from '../api/ordersApi';
import { Order, OrderState } from '../types';

export const createOrder = createAsyncThunk<Order, string[]>(
  'constructor/createOrder',
  async (orderData, { rejectWithValue }) => {
    return await createOrderApi(orderData);
  }
);

const initialState: OrderState = {
  data: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
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
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
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
