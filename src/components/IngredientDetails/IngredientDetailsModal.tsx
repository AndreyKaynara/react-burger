import React from 'react';
import Modal from '../Modal/Modal';
import IngredientDetails from './IngredientDetails';

interface IngredientDetailsModalProps {
  onClose: () => void;
}

const IngredientDetailsModal: React.FC<IngredientDetailsModalProps> = ({ onClose }) => {
  return (
    <Modal title="Детали ингредиента" onClose={onClose}>
      <IngredientDetails />
    </Modal>
  );
};

export default IngredientDetailsModal;
