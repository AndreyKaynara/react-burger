import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import OrderDetails from './OrderDetails';

const OrderDetailsModal = ({ onClose }) => {
  return (
    <Modal title="Детали заказа" onClose={onClose}>
      <OrderDetails />
    </Modal>
  );
};

OrderDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default OrderDetailsModal;
