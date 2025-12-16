import React from 'react';
import Modal from '../Modal/Modal';
import OrderSummary from '../OrderSummary/OrderSummary';

interface OrderSummaryModalProps {
  onClose: () => void;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({ onClose }) => {
  return (
    <Modal title="" onClose={onClose}>
      <OrderSummary />
    </Modal>
  );
};

export default OrderSummaryModal;
