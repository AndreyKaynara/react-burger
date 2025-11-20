import type { User, Ingredient, IngredientInConstructor, Order } from './entities';

export interface AuthState {
  user: User | null;
  accessToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IngredientsState {
  data: Ingredient[];
  counters: Record<string, number>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface BurgerConstructorState {
  bun: IngredientInConstructor | null;
  fillings: IngredientInConstructor[];
  totalPrice: number;
}

export interface OrderState {
  data: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
