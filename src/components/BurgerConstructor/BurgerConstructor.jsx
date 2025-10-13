import React from 'react';
import PropTypes from 'prop-types';
import { ConstructorElement, DragIcon, Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import scrollbarStyles from '../../styles/scrollbar.module.css';
import { ingredientPropType } from '../../utils/prop-types';

const BurgerConstructor = ({ ingredients = [], openModal }) => {
  const bun = ingredients.find((item) => item.type === 'bun');
  const fillings = ingredients.filter((item) => item.type !== 'bun');

  const totalPrice = ingredients.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <section className={styles.constructor}>
      <div className={`mb-10 ${styles.list} ${scrollbarStyles.customScrollbar}`}>
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
        {fillings.map((item) => (
          <div key={item._id} className={styles.row}>
            <div className={styles.drag}>
              <DragIcon type="primary" />
            </div>
            <div className={styles.elem}>
              <ConstructorElement text={item.name} price={item.price} thumbnail={item.image} />
            </div>
          </div>
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
        <Button htmlType="button" type="primary" size="large" onClick={openModal}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  openModal: PropTypes.func.isRequired,
};

export default BurgerConstructor;
