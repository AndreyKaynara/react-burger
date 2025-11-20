import React from 'react';
import Modal from '../Modal/Modal';
import OrderDetails from './OrderDetails';

interface OrderDetailsModalProps {
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ onClose }) => {
  return (
    <Modal title="" onClose={onClose}>
      <OrderDetails />
    </Modal>
  );
};

export default OrderDetailsModal;
