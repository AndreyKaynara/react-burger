import { store } from '../services/store';
import { TypedUseSelectorHook, useDispatch as useDispatchHook, useSelector as useSelectorHook } from 'react-redux';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppActions = Parameters<AppDispatch>[0];
export const useDispatch = () => useDispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorHook;
