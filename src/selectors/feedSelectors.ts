import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { OrderFromFeed, Ingredient } from '../types/entities';

export interface EnrichedOrder extends OrderFromFeed {
  price: number;
}

export const selectFeed = (state: RootState) => state.feed;

export const selectFeedOrders = (state: RootState): OrderFromFeed[] => state.feed.orders;

export const selectFeedStats = (state: RootState): { total: number; totalToday: number } => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday,
});

export const selectFeedConnection = (state: RootState): boolean => state.feed.wsConnected;

export const selectFeedError = (state: RootState): string | null => state.feed.error;

// Селектор для заказов со статусом "done"
export const selectReadyOrders = createSelector(
  [selectFeedOrders],
  (orders: OrderFromFeed[]): number[] =>
    orders
      .filter((order: OrderFromFeed) => order.status === 'done')
      .map((order: OrderFromFeed) => order.number)
      .slice(0, 20) // Максимум 20 заказов (2 колонки по 10)
);

// Селектор для заказов со статусом "pending"
export const selectInProgressOrders = createSelector(
  [selectFeedOrders],
  (orders: OrderFromFeed[]): number[] =>
    orders
      .filter((order: OrderFromFeed) => order.status === 'pending' || order.status === 'created')
      .map((order: OrderFromFeed) => order.number)
      .slice(0, 20) // Максимум 20 заказов
);

// Селектор для получения заказа по номеру
export const selectOrderByNumber = (number: string | number) =>
  createSelector([selectFeedOrders], (orders: OrderFromFeed[]): OrderFromFeed | undefined =>
    orders.find((order: OrderFromFeed) => order.number === Number(number))
  );

// Селектор для обогащения заказов ценой
export const selectEnrichedOrders = createSelector(
  [selectFeedOrders, (state: RootState) => state.ingredients.data],
  (orders: OrderFromFeed[], ingredients: Ingredient[]): EnrichedOrder[] => {
    return orders.map((order: OrderFromFeed): EnrichedOrder => {
      const price: number = order.ingredients.reduce((sum: number, ingredientId: string) => {
        const ingredient: Ingredient | undefined = ingredients.find((ing: Ingredient) => ing._id === ingredientId);
        return sum + (ingredient?.price || 0);
      }, 0);

      return {
        ...order,
        price,
      };
    });
  }
);
