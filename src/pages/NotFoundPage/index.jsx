import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={`text text_type_digits-large ${styles.errorCode}`}>404</h1>
        <p className="text text_type_main-large mb-4">Страница не найдена</p>
        <p className="text text_type_main-default text_color_inactive mb-10">
          К сожалению, запрашиваемая страница не существует
        </p>
        <div className={styles.buttons}>
          <Button htmlType="button" type="primary" size="medium" onClick={handleGoHome}>
            На главную
          </Button>
          <Button htmlType="button" type="secondary" size="medium" onClick={handleGoBack}>
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
