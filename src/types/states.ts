import type { User, Ingredient, IngredientInConstructor, Order, OrderFromFeed } from './entities';

export interface AuthState {
  user: User | null;
  accessToken: string | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IngredientsState {
  data: Ingredient[];
  counters: Record<string, number>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

export interface IngredientDetailsState {
  ingredient: Ingredient | null;
}

export interface BurgerConstructorState {
  bun: IngredientInConstructor | null;
  fillings: IngredientInConstructor[];
  totalPrice: number;
}

export interface OrderState {
  data: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

export interface FeedState {
  orders: OrderFromFeed[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  error: string | null;
}
