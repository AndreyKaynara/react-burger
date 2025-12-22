import reducer, { clearError, initialState } from './authSlice';
import { register, login, logout, checkAuth, updateUser } from './authSlice';

const user = { name: 'Ivan', email: 'ivan@example.com' };

describe('authSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('clearError устанавливает ошибку в null', () => {
    const state = { ...initialState, error: 'err' };
    expect(reducer(state, clearError()).error).toBe(null);
  });

  describe('register', () => {
    it('pending устанавливает загрузку и очищает ошибку', () => {
      const next = reducer(initialState, register.pending('x', { email: '', password: '', name: '' }));
      expect(next.isLoading).toBe(true);
      expect(next.error).toBe(null);
    });
    it('fulfilled устанавливает пользователя, токен и флаги аутентификации', () => {
      const payload = { user, accessToken: 'token' };
      const next = reducer(initialState, register.fulfilled(payload, 'x', { email: '', password: '', name: '' }));
      expect(next.isLoading).toBe(false);
      expect(next.user).toEqual(user);
      expect(next.accessToken).toBe('token');
      expect(next.isAuthenticated).toBe(true);
      expect(next.error).toBe(null);
    });
    it('rejected устанавливает ошибку', () => {
      const action = register.rejected(null, 'x', { email: '', password: '', name: '' }, 'Bad');
      const next = reducer(initialState, action);
      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('Bad');
    });
  });

  describe('login', () => {
    it('pending устанавливает загрузку и очищает ошибку', () => {
      const next = reducer(initialState, login.pending('x', { email: '', password: '' }));
      expect(next.isLoading).toBe(true);
      expect(next.error).toBe(null);
    });
    it('fulfilled устанавливает пользователя и токен', () => {
      const payload = { user, accessToken: 't2' };
      const next = reducer(initialState, login.fulfilled(payload, 'x', { email: '', password: '' }));
      expect(next.isAuthenticated).toBe(true);
      expect(next.user).toEqual(user);
      expect(next.accessToken).toBe('t2');
    });
    it('rejected устанавливает ошибку', () => {
      const action = login.rejected(null, 'x', { email: '', password: '' }, 'Wrong');
      const next = reducer(initialState, action);
      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('Wrong');
    });
  });

  describe('logout', () => {
    it('pending устанавливает загрузку', () => {
      const next = reducer(initialState, logout.pending('x'));
      expect(next.isLoading).toBe(true);
    });
    it('fulfilled сбрасывает данные аутентификации', () => {
      const prev = { ...initialState, user, accessToken: 't', isAuthenticated: true };
      const next = reducer(prev, logout.fulfilled(null, 'x'));
      expect(next.isLoading).toBe(false);
      expect(next.user).toBe(null);
      expect(next.accessToken).toBe(null);
      expect(next.isAuthenticated).toBe(false);
      expect(next.error).toBe(null);
    });
    it('rejected сбрасывает данные аутентификации и устанавливает ошибку', () => {
      const prev = { ...initialState, user, accessToken: 't', isAuthenticated: true };
      const action = logout.rejected('err', 'x', undefined, 'Oops');
      const next = reducer(prev, action);
      expect(next.isLoading).toBe(false);
      expect(next.user).toBe(null);
      expect(next.accessToken).toBe(null);
      expect(next.isAuthenticated).toBe(false);
      expect(next.error).toBe('Oops');
    });
  });

  describe('checkAuth', () => {
    it('pending устанавливает загрузку', () => {
      expect(reducer(initialState, checkAuth.pending('x')).isLoading).toBe(true);
    });
    it('fulfilled устанавливает пользователя и токен, помечает как аутентифицированного', () => {
      const payload = { user, accessToken: 't3' };
      const next = reducer(initialState, checkAuth.fulfilled(payload, 'x'));
      expect(next.isLoading).toBe(false);
      expect(next.user).toEqual(user);
      expect(next.accessToken).toBe('t3');
      expect(next.isAuthenticated).toBe(true);
      expect(next.error).toBe(null);
    });
    it('rejected сбрасывает флаги и очищает ошибку', () => {
      const next = reducer({ ...initialState, user, accessToken: 't', isAuthenticated: true }, checkAuth.rejected('e', 'x'));
      expect(next.isLoading).toBe(false);
      expect(next.user).toBe(null);
      expect(next.accessToken).toBe(null);
      expect(next.isAuthenticated).toBe(false);
      expect(next.error).toBe(null);
    });
  });

  describe('updateUser', () => {
    it('pending очищает ошибку и устанавливает загрузку', () => {
      const next = reducer({ ...initialState, error: 'err' }, updateUser.pending('x', { name: 'A' }));
      expect(next.isLoading).toBe(true);
      expect(next.error).toBe(null);
    });
    it('fulfilled обновляет пользователя', () => {
      const payload = { user: { name: 'Petr', email: 'p@example.com' } };
      const next = reducer(initialState, updateUser.fulfilled(payload, 'x', { name: 'Petr' }));
      expect(next.isLoading).toBe(false);
      expect(next.user).toEqual(payload.user);
      expect(next.error).toBe(null);
    });
    it('rejected устанавливает ошибку', () => {
      const action = updateUser.rejected(null, 'x', { name: 'A' }, 'Fail');
      const next = reducer(initialState, action);
      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('Fail');
    });
  });
});
