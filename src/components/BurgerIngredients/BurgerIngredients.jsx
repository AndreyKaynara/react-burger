import React, { useState, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import scrollbarStyles from '../../styles/scrollbar.module.css';
import IngredientSection from './IngredientSection/IngredientSection';
import { ingredientPropType } from '../../utils/prop-types';

const BurgerIngredients = ({ ingredients, openModal }) => {
  const [currentTab, setCurrentTab] = useState('bun');

  const ingredientsRef = useRef(null);
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

  // Используем Intersection Observer для автоматического переключения табов.
  useEffect(() => {
    const container = ingredientsRef.current;
    if (!container) return;

    // Настройки Observer.
    const options = {
      root: container, // Элемент, с которым сравниваем (базовый контейнер с ингредиентами).
      rootMargin: '0px 0px -95% 0px', // Задаём триггер у верхней границы контейнера.
      threshold: 0, // Достаточно минимального пересечения в 1 пиксель.
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionType = entry.target.dataset.type;
          if (sectionType) {
            setCurrentTab(sectionType);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    if (bunRef.current) observer.observe(bunRef.current);
    if (sauceRef.current) observer.observe(sauceRef.current);
    if (mainRef.current) observer.observe(mainRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
      <div ref={ingredientsRef} className={`${styles.ingredientsList} ${scrollbarStyles.customScrollbar}`}>
        <IngredientSection ref={bunRef} type="bun" title="Булки" items={groupedIngredients.bun} onClick={openModal} />
        <IngredientSection
          ref={sauceRef}
          type="sauce"
          title="Соусы"
          items={groupedIngredients.sauce}
          onClick={openModal}
        />
        <IngredientSection
          ref={mainRef}
          type="main"
          title="Начинки"
          items={groupedIngredients.main}
          onClick={openModal}
        />
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  openModal: PropTypes.func.isRequired,
};

export default BurgerIngredients;
