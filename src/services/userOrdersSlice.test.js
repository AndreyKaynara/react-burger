import reducer, { wsConnect, wsDisconnect, wsOnOpen, wsOnClose, wsOnError, wsOnMessage } from './userOrdersSlice';

const initial = { orders: [], total: 0, totalToday: 0, wsConnected: false, error: null };

const messageOk = {
  success: true,
  orders: [{ _id: '1', number: 2, name: 'B', status: 'pending', ingredients: [], createdAt: 'd', updatedAt: 'd' }],
  total: 5,
  totalToday: 1,
};

const messageFail = { success: false, message: 'Auth ws error' };

describe('userOrdersSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initial);
  });

  it('wsConnect очищает ошибку', () => {
    const next = reducer({ ...initial, error: 'x' }, wsConnect());
    expect(next.error).toBe(null);
  });

  it('wsDisconnect сбрасывает данные и флаги', () => {
    const prev = { orders: [1], total: 1, totalToday: 1, wsConnected: true, error: null };
    const next = reducer(prev, wsDisconnect());
    expect(next).toEqual(initial);
  });

  it('wsOnOpen устанавливает wsConnected=true и очищает ошибку', () => {
    const next = reducer({ ...initial, error: 'e' }, wsOnOpen());
    expect(next.wsConnected).toBe(true);
    expect(next.error).toBe(null);
  });

  it('wsOnClose устанавливает wsConnected=false', () => {
    const next = reducer({ ...initial, wsConnected: true }, wsOnClose());
    expect(next.wsConnected).toBe(false);
  });

  it('wsOnError устанавливает ошибку и wsConnected=false', () => {
    const next = reducer({ ...initial, wsConnected: true }, wsOnError('oops'));
    expect(next.error).toBe('oops');
    expect(next.wsConnected).toBe(false);
  });

  it('wsOnMessage при успехе обновляет данные', () => {
    const next = reducer(initial, wsOnMessage(messageOk));
    expect(next.orders.length).toBe(1);
    expect(next.total).toBe(5);
    expect(next.totalToday).toBe(1);
  });

  it('wsOnMessage при ошибке устанавливает ошибку', () => {
    const next = reducer(initial, wsOnMessage(messageFail));
    expect(next.error).toBe('Auth ws error');
  });
});
