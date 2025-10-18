import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './App.module.css';
import AppHeader from './components/AppHeader/AppHeader';
import BurgerIngredients from './components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from './components/BurgerConstructor/BurgerConstructor';
import IngredientDetails from './components/Modal/IngredientDetails/IngredientDetails';
import OrderDetails from './components/Modal/OrderDetails/OrderDetails';
import { setIngredient, clearIngredient } from './services/ingredientDetailsSlice';
import { clearOrder } from './services/orderSlice';

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const selectedIngredient = useSelector((state: any) => state.ingredientDetails.ingredient);

  const dispatch = useDispatch<any>();

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
            <BurgerIngredients openModal={openIngredientModal} />
          </div>
          <div className={styles.column}>
            <BurgerConstructor openModal={openOrderModal} />
          </div>
        </main>
      </div>
      {activeModal === 'ingredient' && selectedIngredient && <IngredientDetails onClose={closeIngredientModal} />}

      {activeModal === 'order' && <OrderDetails onClose={closeOrderModal} />}
    </>
  );
}

export default App;
