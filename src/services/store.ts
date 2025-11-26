import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as useDispatchHook, useSelector as useSelectorHook } from 'react-redux';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constuctorSlice';
import ingredientDetailsReducer from './ingredientDetailsSlice';
import orderReducer from './orderSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useDispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorHook;
