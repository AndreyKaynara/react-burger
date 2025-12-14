import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constuctorSlice';
import ingredientDetailsReducer from './ingredientDetailsSlice';
import orderReducer from './orderSlice';
import authReducer from './authSlice';
import feedSlice, { WS_FEED_ACTIONS } from './feedSlice';
import userOrdersReducer, { WS_USER_ORDERS_ACTIONS } from './userOrdersSlice';
import { createWebSocketMiddleware } from '../middlewares/websocketMiddleware';
import { API_WS_ORDERS_URL, API_WS_USER_ORDERS_URL } from '../api/api';

const feedMiddleware = createWebSocketMiddleware(API_WS_ORDERS_URL, WS_FEED_ACTIONS, false);
const userOrdersMiddleware = createWebSocketMiddleware(API_WS_USER_ORDERS_URL, WS_USER_ORDERS_ACTIONS, true);

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    auth: authReducer,
    feed: feedSlice,
    userOrders: userOrdersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(feedMiddleware, userOrdersMiddleware),
});
