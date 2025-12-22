import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { registerApi, loginApi, logoutApi, getUserDataApi, updateUserApi } from '../api/authApi';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import { callWithTokenRefresh } from '../utils/callWithTokenRefresh';
import { AuthState, UserRegisterData, UpdateUserData, User } from '../types';

export const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const handleApiError = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    const msg = error.message.toLowerCase();

    if (msg.includes('email') || msg.includes('password')) {
      return 'Неверный email или пароль';
    }

    return error.message;
  }

  return 'Произошла ошибка. Попробуйте еще раз';
};

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface UpdateUserResponse {
  user: User;
}

export const register = createAsyncThunk<AuthResponse, UserRegisterData, { rejectValue: string }>(
  'auth/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const data = await registerApi({ email, password, name });

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      setCookie('accessToken', data.accessToken);
      setCookie('refreshToken', data.refreshToken);

      return {
        user: data.user,
        accessToken: data.accessToken,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const login = createAsyncThunk<AuthResponse, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi(email, password);

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      setCookie('accessToken', data.accessToken);
      setCookie('refreshToken', data.refreshToken);

      return {
        user: data.user,
        accessToken: data.accessToken,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const logout = createAsyncThunk<null, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const refreshTokenValue = getCookie('refreshToken');

    try {
      if (refreshTokenValue) {
        await logoutApi(refreshTokenValue);
      }
      return null;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    } finally {
      // Всегда удаляем токены
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    }
  }
);

export const checkAuth = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await callWithTokenRefresh((token) => getUserDataApi(token));
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return {
        user: data.user,
        accessToken: getCookie('accessToken') || '',
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk<UpdateUserResponse, UpdateUserData, { rejectValue: string }>(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await callWithTokenRefresh((token) => updateUserApi(token, userData));
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return { user: data.user };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Произошла ошибка при регистрации';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Произошла ошибка при входе';
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? 'Произошла ошибка при выходе';
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UpdateUserResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Произошла ошибка при обновлении профиля';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
