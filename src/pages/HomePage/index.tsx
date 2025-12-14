import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';
import OrderSummaryModal from '../../components/OrdersFeed/OrderSummaryModal';
import { setIngredient } from '../../services/ingredientDetailsSlice';
import { clearOrder } from '../../services/orderSlice';
import styles from './HomePage.module.css';
import { Ingredient } from '../../types';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);

  const openIngredientModal = (ingredient: Ingredient) => {
    dispatch(setIngredient(ingredient));
    // Передаём текущий location как background
    navigate(`/ingredients/${ingredient._id}`, { state: { background: location } });
  };

  const openOrderModal = () => {
    setOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
    dispatch(clearOrder());
  };

  return (
    <>
      <h1 className="text_type_main-large mt-10 mb-5">Соберите бургер</h1>
      <main className={styles.main}>
        <div className={styles.column}>
          <BurgerIngredients openModal={openIngredientModal} />
        </div>
        <div className={styles.column}>
          <BurgerConstructor openModal={openOrderModal} />
        </div>
      </main>

      {orderModalOpen && <OrderSummaryModal onClose={closeOrderModal} />}
    </>
  );
}
