import React, { useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { ConstructorElement, Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import scrollbarStyles from '../../styles/scrollbar.module.css';
import { addIngredient, removeIngredient, clearConstructor, reorderIngredients } from '../../services/constuctorSlice';
import { incrementCounter, decrementCounter, resetCounters } from '../../services/ingredientsSlice';
import { createOrder } from '../../services/orderSlice';
import ConstructorIngredient from './ConstructorIngredient/ConstructorIngredient';
import { Ingredient, BurgerConstructorState } from '../../types';

interface BurgerConstructorProps {
  openModal: () => void;
}

interface AuthState {
  isAuthenticated: boolean;
}

interface DragItem {
  ingredient: Ingredient;
}

interface DropCollectedProps {
  isOver: boolean;
}

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({ openModal }) => {
  const { bun, fillings, totalPrice } = useSelector((state) => state.burgerConstructor) as BurgerConstructorState;
  const { isAuthenticated } = useSelector((state) => state.auth) as AuthState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [{ isOver }, dropRef] = useDrop<DragItem, void, DropCollectedProps>({
    accept: ['ingredient', 'constructor-ingredient'],
    drop: (item, monitor) => {
      if (monitor.getItemType() === 'constructor-ingredient') {
        return;
      }
      const ingredient = item.ingredient;
      dispatch(addIngredient(ingredient));

      if (ingredient.type === 'bun') {
        // Уменьшаем счётчик старой булки и увеличиваем счётчик у новой.
        if (bun && ingredient._id !== bun._id) {
          dispatch(decrementCounter(bun._id));
          dispatch(incrementCounter(ingredient._id));
        }
        if (!bun) {
          dispatch(incrementCounter(ingredient._id));
        }
      } else {
        dispatch(incrementCounter(ingredient._id));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveIngredient = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch(reorderIngredients({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  const handleOrderClick = () => {
    // Проверяем авторизацию
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bun) {
      alert('Необходимо выбрать булку');
      return;
    }

    // Указываем булочку дважды, так как есть верхняя и нижняя.
    const ingredientIds: string[] = [bun._id, ...fillings.map((item) => item._id), bun._id];

    dispatch(createOrder(ingredientIds as any) as any)
      .unwrap()
      .then(() => {
        dispatch(clearConstructor(undefined));
        dispatch(resetCounters());
        openModal();
      })
      .catch((error: unknown) => {
        console.log('Ошибка заказа: ', error);
        alert('Ошибка заказа');
      });
  };

  return (
    <section className={styles.burgerConstructor}>
      <div
        ref={dropRef}
        className={`mb-10 ${styles.list} ${scrollbarStyles.customScrollbar} ${isOver ? styles.dragOver : ''}`}
      >
        {/* Верхняя булка */}
        {bun && (
          <div className={styles.row}>
            <div className={styles.dragPlaceholder} />
            <div className={styles.elem}>
              <ConstructorElement
                type="top"
                isLocked={true}
                text={`${bun.name} (верх)`}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          </div>
        )}

        {/* Начинки */}
        {fillings.map((item, index) => (
          <ConstructorIngredient
            key={item.uuid}
            ingredient={item}
            index={index}
            moveIngredient={moveIngredient}
            onDelete={() => {
              dispatch(removeIngredient(item));
              dispatch(decrementCounter(item._id));
            }}
          />
        ))}

        {/* Нижняя булка */}
        {bun && (
          <div className={styles.row}>
            <div className={styles.dragPlaceholder} />
            <div className={styles.elem}>
              <ConstructorElement
                type="bottom"
                isLocked={true}
                text={`${bun.name} (низ)`}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          </div>
        )}
      </div>

      {/* Цена и кнопка заказа */}
      <div className={styles.total}>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={handleOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
