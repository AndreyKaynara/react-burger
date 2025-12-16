import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './IngredientCard.module.css';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../../types';
import { useSelector } from '../../../types/store';

interface IngredientCardProps {
  ingredient: Ingredient;
  onClick: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onClick }) => {
  const count = useSelector((state) => state.ingredients.counters[ingredient._id]);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div ref={dragRef} className={`${styles.itemCard}`} onClick={onClick} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={ingredient.image} alt={ingredient.name} className="ml-4 mr-4" />
      <div className={`mt-1 mb-1 ${styles.price}`}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className="text text_type_main-default mt-2">{ingredient.name}</p>
      {count > 0 && <Counter count={count} size="default" />}
    </div>
  );
};

export default IngredientCard;
