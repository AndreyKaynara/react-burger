import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../types/store';
import { wsConnect, wsDisconnect } from '../../services/feedSlice';
import {
  selectEnrichedOrders,
  selectFeedStats,
  selectReadyOrders,
  selectInProgressOrders,
  selectFeedConnection,
  selectFeedError,
  EnrichedOrder,
} from '../../selectors/feedSelectors';
import OrdersFeed from '../../components/OrdersFeed/OrdersFeed';
import styles from './OrdersFeedPage.module.css';
import Statistics from '../../components/Statistics/Statistics';

const OrdersFeedPage: FC = () => {
  const dispatch = useDispatch();

  const orders: EnrichedOrder[] = useSelector(selectEnrichedOrders);
  const stats: { total: number; totalToday: number } = useSelector(selectFeedStats);
  const readyOrders: number[] = useSelector(selectReadyOrders);
  const inProgressOrders: number[] = useSelector(selectInProgressOrders);
  const isConnected: boolean = useSelector(selectFeedConnection);
  const error: string | null = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(wsConnect());

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  return (
    <div className={styles.pageContainer}>
      <h1 className={`text text_type_main-large mb-5 ${styles.centerText}`}>
        Лента заказов
      </h1>

      {error && (
        <p className={`text text_type_main-default mb-4 ${styles.errorText}`}>
          Ошибка подключения: {error}
        </p>
      )}

      {!isConnected && !error && (
        <p className={`text text_type_main-default mb-4 ${styles.centerText}`}>
          Подключение к серверу...
        </p>
      )}

      {isConnected && orders.length === 0 && (
        <p className={`text text_type_main-default mb-4 ${styles.centerText}`}>
          Заказов пока нет
        </p>
      )}

      {orders.length > 0 && (
        <div className={styles.contentGrid}>
          <OrdersFeed orders={orders} redirectPath="/feed" />
          <div>
            <Statistics
              total={stats.total}
              totalToday={stats.totalToday}
              ready={readyOrders}
              inProgress={inProgressOrders}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersFeedPage;
