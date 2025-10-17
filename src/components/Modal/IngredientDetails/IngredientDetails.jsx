import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Modal from '../Modal';
import styles from './IngredientDetails.module.css';

const IngredientDetails = ({ onClose }) => {
  const ingredient = useSelector((state) => state.ingredientDetails.ingredient);

  return (
    <Modal title="Детали ингредиента" onClose={onClose}>
      <div className={styles.content}>
        <img className={styles.image} src={ingredient.image_large} alt={ingredient.name}></img>
        <h2 className="mt-4 mb-8 text text_type_main-medium">{ingredient.name}</h2>

        <div className={styles.textList}>
          <div className={styles.textItem}>
            <span className="text text_type_main-default text_color_inactive">Калории, ккал</span>
            <span className="text text_type_digits-default text_color_inactive">{ingredient.calories}</span>
          </div>
          <div className={styles.textItem}>
            <span className="text text_type_main-default text_color_inactive">Белки, г</span>
            <span className="text text_type_digits-default text_color_inactive">{ingredient.proteins}</span>
          </div>
          <div className={styles.textItem}>
            <span className="text text_type_main-default text_color_inactive">Жиры, г</span>
            <span className="text text_type_digits-default text_color_inactive">{ingredient.fat}</span>
          </div>
          <div className={styles.textItem}>
            <span className="text text_type_main-default text_color_inactive">Углеводы, г</span>
            <span className="text text_type_digits-default text_color_inactive">{ingredient.carbohydrates}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

IngredientDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default IngredientDetails;
