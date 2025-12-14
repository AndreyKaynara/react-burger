import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { OrderFromFeed, Ingredient } from '../types/entities';

export interface EnrichedUserOrder extends OrderFromFeed {
  price: number;
}

export const selectUserOrdersState = (state: RootState) => state.userOrders;

export const selectUserOrders = (state: RootState): OrderFromFeed[] => state.userOrders.orders;

export const selectUserOrdersConnection = (state: RootState): boolean => state.userOrders.wsConnected;

export const selectUserOrdersError = (state: RootState): string | null => state.userOrders.error;

export const selectEnrichedUserOrders = createSelector(
  [selectUserOrders, (state: RootState) => state.ingredients.data],
  (orders: OrderFromFeed[], ingredients: Ingredient[]): EnrichedUserOrder[] => {
    return orders
      .map((order: OrderFromFeed): EnrichedUserOrder => {
        const price = order.ingredients.reduce((sum: number, ingredientId: string) => {
          const ingredient = ingredients.find((ing: Ingredient) => ing._id === ingredientId);
          return sum + (ingredient?.price ?? 0);
        }, 0);

        return {
          ...order,
          price,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
);

export const selectUserOrderByNumber = (number: string | number) =>
  createSelector([selectUserOrders], (orders: OrderFromFeed[]): OrderFromFeed | undefined =>
    orders.find((order: OrderFromFeed) => order.number === Number(number))
  );
