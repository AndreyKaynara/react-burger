import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Modal from '../Modal';
import styles from './OrderDetails.module.css';

const OrderDetails = ({ onClose }) => {
  const { data: order } = useSelector((state) => state.order);

  return (
    <Modal title="" onClose={onClose}>
      <div className={styles.content}>
        <p className={`text text_type_digits-large mb-8 ${styles.orderNumber}`}>{order.number}</p>
        <p className="text text_type_main-medium">идентификатор заказа</p>
        <div className={`mt-15 mb-15 ${styles.iconWrapper}`}>
          <div className={`${styles.pentagon} ${styles.pentagon1}`}></div>
          <div className={`${styles.pentagon} ${styles.pentagon2}`}></div>
          <div className={`${styles.pentagon} ${styles.pentagon3}`}></div>
          <div className={styles.iconCircle}></div>
          <div className={styles.iconContainer}>
            <CheckMarkIcon type="primary" />
          </div>
        </div>
        <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
        <p className="text text_type_main-default text_color_inactive mb-15">
          Дождитесь готовности на орбитальной станции
        </p>
      </div>
    </Modal>
  );
};

OrderDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default OrderDetails;
