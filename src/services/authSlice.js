import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi, loginApi, logoutApi, getUserDataApi, updateUserApi } from '../api/authApi';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import { callWithTokenRefresh } from '../utils/callWithTokenRefresh';

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const handleApiError = (error) => {
  if (error.message) {
    if (error.message.toLowerCase().includes('email') || error.message.toLowerCase().includes('password')) {
      return 'Неверный email или пароль';
    }
    return error.message;
  }
  return 'Произошла ошибка. Попробуйте еще раз';
};

// Async thunks
export const register = createAsyncThunk('auth/register', async ({ email, password, name }, { rejectWithValue }) => {
  try {
    const data = await registerApi({ email, password, name });

    setCookie('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken);

    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginApi(email, password);

    setCookie('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken);

    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
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
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const data = await callWithTokenRefresh((token) => getUserDataApi(token));
    return {
      user: data.user,
      accessToken: getCookie('accessToken'),
    };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await callWithTokenRefresh((token) => updateUserApi(token, userData));
    return { user: data.user };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

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
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
        state.error = action.payload;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
