import React, { FC, useEffect } from 'react';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import OrdersFeed from '../../components/OrdersFeed/OrdersFeed';
import styles from './OrdersHistoryPage.module.css';
import { useDispatch, useSelector } from '../../types/store';
import { wsConnect, wsDisconnect } from '../../services/userOrdersSlice';
import {
  selectEnrichedUserOrders,
  selectUserOrdersConnection,
  selectUserOrdersError,
  EnrichedUserOrder,
} from '../../selectors/userOrdersSelectors';

const OrdersHistoryPage: FC = () => {
  const dispatch = useDispatch();

  const orders: EnrichedUserOrder[] = useSelector(selectEnrichedUserOrders);
  const isConnected: boolean = useSelector(selectUserOrdersConnection);
  const error: string | null = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ProfileSidebar description="В этом разделе вы можете просмотреть свою историю заказов" />

        <div className={`${styles.content} pl-15`}>
          {error && <p className={`text text_type_main-default mb-4 ${styles.error}`}>Ошибка подключения: {error}</p>}
          {!isConnected && !error && <p className="text text_type_main-default mb-4">Подключение к серверу...</p>}
          {isConnected && orders.length === 0 && (
            <p className="text text_type_main-default mb-4">У вас пока нет заказов</p>
          )}

          {orders.length > 0 && <OrdersFeed orders={orders} showStatus={true} redirectPath="/profile/orders" />}
        </div>
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
