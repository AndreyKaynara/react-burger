import React from 'react';
import styles from './IngredientSection.module.css';
import IngredientCard from '../IngredientCard/IngredientCard';
import { Ingredient } from '../../../types';

interface IngredientSectionProps {
  type: 'bun' | 'sauce' | 'main';
  title: string;
  items: Ingredient[];
  onClick: (item: Ingredient) => void;
}

const IngredientSection = React.forwardRef<HTMLDivElement, IngredientSectionProps>(
  ({ type, title, items, onClick }, ref) => {
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
  }
);

export default IngredientSection;
