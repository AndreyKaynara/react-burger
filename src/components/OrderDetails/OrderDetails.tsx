import React, { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../types/store';
import { selectOrderByNumber } from '../../selectors/feedSelectors';
import { selectUserOrderByNumber } from '../../selectors/userOrdersSelectors';
import { Ingredient } from '../../types';
import { getOrderByNumber } from '../../api/ordersApi';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetails.module.css';

type OrderStatus = 'done' | 'pending' | 'created' | 'cancelled';

interface OrderLike {
  number: number;
  name: string;
  status: OrderStatus;
  ingredients: string[];
  createdAt: string;
}

const OrderDetails: FC = () => {
  const params = useParams();
  const orderNumber = Number(params.number);

  const feedOrder = useSelector((state) => selectOrderByNumber(orderNumber)(state));
  const userOrder = useSelector((state) => selectUserOrderByNumber(orderNumber)(state));
  const ingredients: Ingredient[] = useSelector((state) => state.ingredients.data);

  const [order, setOrder] = useState<OrderLike | null>(feedOrder || null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (feedOrder || userOrder) {
      setOrder((feedOrder || userOrder) as OrderLike);
      return;
    }
    if (!order && orderNumber && !Number.isNaN(orderNumber)) {
      setLoading(true);
      getOrderByNumber(orderNumber)
        .then((o) => setOrder(o as OrderLike | null))
        .finally(() => setLoading(false));
    }
  }, [order, feedOrder, userOrder, orderNumber]);

  const ingredientCounts = useMemo(() => {
    if (!order) return {} as Record<string, number>;
    return order.ingredients.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  }, [order]);

  const uniqueIngredientIds = useMemo(() => {
    if (!order) return [] as string[];
    return Array.from(new Set(order.ingredients));
  }, [order]);

  const totalPrice = useMemo(() => {
    if (!order) return 0;
    return order.ingredients.reduce((sum, id) => {
      const ing = ingredients.find((i) => i._id === id);
      return sum + (ing?.price || 0);
    }, 0);
  }, [order, ingredients]);

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      case 'cancelled':
        return 'Отменен';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default">Загрузка заказа...</p>
      </div>
    );
  }

  if (!order) {
    return <div className={styles.container}>Заказ не найден</div>;
  }

  return (
    <div className={styles.container}>
      <p className={`text text_type_digits-default ${styles.orderNumber}`}>#{order.number}</p>

      <h2 className="text text_type_main-medium mb-3">{order.name}</h2>

      <p className={`text text_type_main-default mb-15 ${styles.statusDone}`}>{getStatusText(order.status)}</p>

      <h3 className="text text_type_main-medium mb-6">Состав:</h3>

      <div className={styles.compositionList}>
        {uniqueIngredientIds.map((ingredientId) => {
          const ingredient = ingredients.find((ing) => ing._id === ingredientId);
          const count = ingredientCounts[ingredientId];
          if (!ingredient) return null;
          return (
            <div key={ingredientId} className={styles.compositionItem}>
              <div className={styles.ingredientImageWrapper}>
                <img src={ingredient.image} alt={ingredient.name} className={styles.ingredientImage} />
              </div>
              <p className="text text_type_main-default">{ingredient.name}</p>
              <div className={styles.priceContainer}>
                <p className="text text_type_digits-default">
                  {count} x {ingredient.price}
                </p>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </p>
        <div className={styles.priceContainer}>
          <p className="text text_type_digits-medium">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
