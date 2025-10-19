import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import IngredientDetails from './IngredientDetails';

const IngredientDetailsModal = ({ onClose }) => {
  return (
    <Modal title="Детали ингредиента" onClose={onClose}>
      <IngredientDetails />
    </Modal>
  );
};

IngredientDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default IngredientDetailsModal;
