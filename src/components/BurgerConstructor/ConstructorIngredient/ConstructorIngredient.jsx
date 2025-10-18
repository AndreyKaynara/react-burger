import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ConstructorIngredient.module.css';
import { ingredientPropType } from '../../../utils/prop-types';

const ConstructorIngredient = ({ ingredient, index, moveIngredient, onDelete }) => {
  const ref = useRef(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'constructor-ingredient',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: 'constructor-ingredient',
    hover: (draggedItem) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // Заменять элемент сам на себя не нужно
      if (dragIndex === hoverIndex) {
        return;
      }

      moveIngredient(dragIndex, hoverIndex);

      draggedItem.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Объединяем refs, элементы должны быть одновременно draggable и droppable
  dragRef(dropRef(ref));

  return (
    <div ref={ref} className={`${styles.row} ${isDragging ? styles.dragging : ''} ${isOver ? styles.over : ''}`}>
      <div className={styles.drag}>
        <DragIcon type="primary" />
      </div>
      <div className={styles.elem}>
        <ConstructorElement
          text={ingredient.name}
          price={ingredient.price}
          thumbnail={ingredient.image}
          handleClose={onDelete}
        />
      </div>
    </div>
  );
};

ConstructorIngredient.propTypes = {
  ingredient: ingredientPropType.isRequired,
  index: PropTypes.number.isRequired,
  moveIngredient: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ConstructorIngredient;
