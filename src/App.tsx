import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './App.module.css';
import AppHeader from './components/AppHeader/AppHeader';
import BurgerIngredients from './components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from './components/BurgerConstructor/BurgerConstructor';
import IngredientDetails from './components/Modal/IngredientDetails/IngredientDetails';
import OrderDetails from './components/Modal/OrderDetails/OrderDetails';
import { fetchIngredients } from './services/ingredientsSlice';
import { setIngredient, clearIngredient } from './services/ingredientDetailsSlice';
import { clearOrder } from './services/orderSlice';

function App() {
  const { data: ingredients, status, error } = useSelector((state: any) => state.ingredients);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const selectedIngredient = useSelector((state: any) => state.ingredientDetails.ingredient);

  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'failed') {
    return <div>Произошла ошибка: {error}</div>;
  }

  const openIngredientModal = (ingredient: any) => {
    dispatch(setIngredient(ingredient));
    setActiveModal('ingredient');
  };

  const openOrderModal = () => {
    setActiveModal('order');
  };

  const closeIngredientModal = () => {
    setActiveModal(null);
    dispatch(clearIngredient());
  };

  const closeOrderModal = () => {
    setActiveModal(null);
    dispatch(clearOrder());
  };

  return (
    <>
      <AppHeader />
      <div className={styles.app}>
        <h1 className="text_type_main-large mt-10 mb-5">Соберите бургер</h1>
        <main className={styles.main}>
          <div className={styles.column}>
            <BurgerIngredients ingredients={ingredients} openModal={openIngredientModal} />
          </div>
          <div className={styles.column}>
            <BurgerConstructor ingredients={ingredients} openModal={openOrderModal} />
          </div>
        </main>
      </div>
      {activeModal === 'ingredient' && selectedIngredient && <IngredientDetails onClose={closeIngredientModal} />}

      {activeModal === 'order' && <OrderDetails onClose={closeOrderModal} />}
    </>
  );
}

export default App;
