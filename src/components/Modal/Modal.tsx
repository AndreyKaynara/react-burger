import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ModalOverlay from './ModalOverlay';
import styles from './Modal.module.css';

const modalRoot = document.getElementById('modal') as HTMLElement;

interface ModalProps {
  title: string | null;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    // Обрабатываем нажатия Esc.
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const modalContent = (
    <>
      <ModalOverlay onClose={onClose} />
      <div className={`pl-10 pr-10 pt-10 pb-15 ${styles.modal}`}>
        <div className={styles.header}>
          <h2 className="text text_type_main-large">{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <CloseIcon type="primary" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
