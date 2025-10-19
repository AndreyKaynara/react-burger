import React from 'react';
import PropTypes from 'prop-types';
import styles from './IngredientSection.module.css';
import IngredientCard from '../IngredientCard/IngredientCard';
import { ingredientPropType } from '../../../utils/prop-types';

const IngredientSection = React.forwardRef(({ type, title, items, onClick }, ref) => {
  return (
    <div ref={ref} data-type={type}>
      <h3 className="text text_type_main-medium mt-10 mb-6">{title}</h3>
      <div className={`ml-4 mr-4 ${styles.itemsRow}`}>
        {items.map((item) => (
          <IngredientCard key={item._id} ingredient={item} onClick={() => onClick(item)} />
        ))}
      </div>
    </div>
  );
});

IngredientSection.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ingredientPropType).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default IngredientSection;
