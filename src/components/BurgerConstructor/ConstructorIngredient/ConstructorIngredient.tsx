import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ConstructorIngredient.module.css';
import { IngredientInConstructor } from '../../../types';

interface ConstructorIngredientProps {
  ingredient: IngredientInConstructor;
  index: number;
  moveIngredient: (fromIndex: number, toIndex: number) => void;
  onDelete: () => void;
}

interface DragItem {
  index: number;
}

interface DropCollectedProps {
  isOver: boolean;
}

const ConstructorIngredient: React.FC<ConstructorIngredientProps> = ({
  ingredient,
  index,
  moveIngredient,
  onDelete,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'constructor-ingredient',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop<DragItem, void, DropCollectedProps>({
    accept: 'constructor-ingredient',
    hover: (draggedItem) => {
      console.log(draggedItem);
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

export default ConstructorIngredient;
