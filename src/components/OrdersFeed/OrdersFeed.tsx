import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector } from '../../types/store';
import { EnrichedOrder } from '../../selectors/feedSelectors';
import { Ingredient } from '../../types';
import styles from './OrdersFeed.module.css';

interface OrdersFeedProps {
  orders: EnrichedOrder[];
  showStatus?: boolean;
  redirectPath?: string;
}

const OrdersFeed: FC<OrdersFeedProps> = ({ orders, showStatus = false, redirectPath = '/feed' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ingredients: Ingredient[] = useSelector((state) => state.ingredients.data);

  const getStatusText = (status: EnrichedOrder['status']): string => {
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

  const getStatusClass = (status: EnrichedOrder['status']): string => {
    switch (status) {
      case 'done':
        return styles.statusDone;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const handleOrderClick = (orderNumber: number): void => {
    navigate(`${redirectPath}/${orderNumber}`, { state: { background: location } });
  };

  return (
    <div className={styles.feedContainer}>
      {orders.map((order: EnrichedOrder) => {
        const maxVisible: number = 6;
        // Получаем уникальные ингредиенты для отображения
        const uniqueIngredients: string[] = Array.from(new Set(order.ingredients));
        const visibleIngredients: string[] = uniqueIngredients.slice(0, maxVisible);
        const remainingCount: number = uniqueIngredients.length - maxVisible;

        return (
          <div key={order._id} onClick={() => handleOrderClick(order.number)} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <p className="text text_type_digits-default">#{order.number}</p>
              <p className="text text_type_main-default text_color_inactive">
                <FormattedDate date={new Date(order.createdAt)} />
              </p>
            </div>

            <h3 className="text text_type_main-medium mb-6">{order.name}</h3>

            {showStatus && (
              <p className={`text text_type_main-default mb-6 ${getStatusClass(order.status)}`}>
                {getStatusText(order.status)}
              </p>
            )}

            <div className={styles.orderFooter}>
              <div className={styles.ingredientsContainer}>
                {visibleIngredients.map((ingredientId: string, index: number) => {
                  const ingredient: Ingredient | undefined = ingredients.find(
                    (ing: Ingredient) => ing._id === ingredientId
                  );

                  return (
                    <div
                      key={`${ingredientId}-${index}`}
                      className={styles.ingredientIcon}
                      style={{
                        marginLeft: index === 0 ? 0 : '-16px',
                        zIndex: maxVisible - index,
                      }}
                    >
                      {ingredient?.image && (
                        <img src={ingredient.image} alt={ingredient.name} className={styles.ingredientImage} />
                      )}
                      {index === maxVisible - 1 && remainingCount > 0 && (
                        <div className={styles.ingredientOverlay}>
                          <span className="text text_type_main-default">+{remainingCount}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={styles.priceContainer}>
                <p className="text text_type_digits-medium">{order.price}</p>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersFeed;
