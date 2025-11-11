import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import { setIngredient } from '../../services/ingredientDetailsSlice';
import styles from './IngredientPage.module.css';
import { fetchIngredients } from '../../services/ingredientsSlice';

export default function IngredientPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: ingredients, status, error } = useSelector((state) => state.ingredients);
  const ingredient = useSelector((state) => state.ingredientDetails.ingredient);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Находим ингредиент по id из URL и кладём в стор
    const ingredient = ingredients.find((item) => item._id === id);
    if (ingredient) {
      dispatch(setIngredient(ingredient));
    }
  }, [id, ingredients, dispatch]);

  if (!ingredient) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Ингредиент не найден</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-10 mb-5">Детали ингредиента</h1>
      <IngredientDetails />
    </div>
  );
}
