import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import scrollbarStyles from '../../styles/scrollbar.module.css';
import IngredientSection from './IngredientSection/IngredientSection';
import { ingredientPropType } from '../../utils/prop-types';

const BurgerIngredients = ({ ingredients, openModal }) => {
  const [currentTab, setCurrentTab] = useState('bun');

  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);

  // Делаем ссылки на разделы списка с ингредиентами.
  const scrollTo = (type) => {
    if (type === 'bun' && bunRef.current) bunRef.current.scrollIntoView({ behavior: 'smooth' });
    if (type === 'sauce' && sauceRef.current) sauceRef.current.scrollIntoView({ behavior: 'smooth' });
    if (type === 'main' && mainRef.current) mainRef.current.scrollIntoView({ behavior: 'smooth' });
    setCurrentTab(type);
  };

  // Группируем ингредиенты по типу, чтобы потом передать в отдельную секцию.
  const groupedIngredients = useMemo(
    () => ({
      bun: ingredients.filter((item) => item.type === 'bun'),
      sauce: ingredients.filter((item) => item.type === 'sauce'),
      main: ingredients.filter((item) => item.type === 'main'),
    }),
    [ingredients]
  );

  return (
    <section className={styles.ingredients}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <Tab value="bun" active={currentTab === 'bun'} onClick={() => scrollTo('bun')}>
          Булки
        </Tab>
        <Tab value="sauce" active={currentTab === 'sauce'} onClick={() => scrollTo('sauce')}>
          Соусы
        </Tab>
        <Tab value="main" active={currentTab === 'main'} onClick={() => scrollTo('main')}>
          Начинки
        </Tab>
      </div>

      {/* Список ингредиентов */}
      <div className={`${styles.ingredientsList} ${scrollbarStyles.customScrollbar}`}>
        <IngredientSection ref={bunRef} title="Булки" items={groupedIngredients.bun} onClick={openModal} />
        <IngredientSection ref={sauceRef} title="Соусы" items={groupedIngredients.sauce} onClick={openModal} />
        <IngredientSection ref={mainRef} title="Начинки" items={groupedIngredients.main} onClick={openModal} />
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  openModal: PropTypes.func.isRequired,
};

export default BurgerIngredients;
