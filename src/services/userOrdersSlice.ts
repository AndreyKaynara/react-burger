import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeedState, FeedWsMessage } from '../types';

export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  error: null,
};

export const WS_USER_ORDERS_ACTIONS = {
  connect: 'userOrders/wsConnect',
  disconnect: 'userOrders/wsDisconnect',
  onOpen: 'userOrders/wsOnOpen',
  onClose: 'userOrders/wsOnClose',
  onError: 'userOrders/wsOnError',
  onMessage: 'userOrders/wsOnMessage',
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    wsConnect: (state) => {
      state.error = null;
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    },
    wsOnOpen: (state) => {
      state.wsConnected = true;
      state.error = null;
    },
    wsOnClose: (state) => {
      state.wsConnected = false;
    },
    wsOnError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.wsConnected = false;
    },
    wsOnMessage: (state, action: PayloadAction<FeedWsMessage>) => {
      const message = action.payload;
      if (message.success) {
        state.orders = message.orders;
        state.total = message.total;
        state.totalToday = message.totalToday;
      } else {
        state.error = message.message;
      }
    },
  },
});

export const { wsConnect, wsDisconnect, wsOnOpen, wsOnClose, wsOnError, wsOnMessage } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
