import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import AppHeader from './components/AppHeader/AppHeader';
import BurgerIngredients from './components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from './components/BurgerConstructor/BurgerConstructor';
import IngredientDetails from './components/Modal/IngredientDetails/IngredientDetails';
import OrderDetails from './components/Modal/OrderDetails/OrderDetails';

const API_SERVER_URL = 'https://norma.nomoreparties.space/';
const INGREDIENTS_URL = 'api/ingredients';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null); // данные выбранного ингредиента

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_SERVER_URL}${INGREDIENTS_URL}`);

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        if (data.success === true) {
          setIngredients(data.data);
          setError(null);
        } else {
          setIngredients([]);
          setError('Ошибка сервера API.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error(`Произошла ошибка при обращении к API: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Произошла ошибка: {error}</div>;
  }

  const openIngredientModal = (ingredient: any) => {
    setSelectedIngredient(ingredient);
    setActiveModal('ingredient');
  };

  const openOrderModal = () => {
    setActiveModal('order');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedIngredient(null);
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
      {activeModal === 'ingredient' && selectedIngredient && (
        <IngredientDetails ingredient={selectedIngredient} onClose={closeModal} />
      )}

      {activeModal === 'order' && <OrderDetails onClose={closeModal} />}
    </>
  );
}

export default App;
