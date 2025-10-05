import React from 'react';
import PropTypes from 'prop-types';
import styles from './IngredientCard.module.css';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

const IngredientCard = ({ name, price, image, count, onClick }) => {
  return (
    <div className={`${styles.itemCard}`} onClick={onClick}>
      <img src={image} alt={name} className="ml-4 mr-4" />
      <div className={`mt-1 mb-1 ${styles.price}`}>
        <span className="text text_type_digits-default">{price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className="text text_type_main-default mt-2">{name}</p>
      {count > 0 && <Counter count={count} size="default" />}
    </div>
  );
};

IngredientCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default IngredientCard;
