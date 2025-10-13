import React from 'react';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <a href="/burger-constructor">
            <BurgerIcon type="primary" />
            <span className="text text_type_main-default">Конструктор</span>
          </a>
          <a href="/orders-list">
            <ListIcon type="secondary" />
            <span className="text text_type_main-default text_color_inactive">Лента заказов</span>
          </a>
        </div>

        <div className={styles.center}>
          <Logo />
        </div>

        <div className={styles.right}>
          <a href="/profile">
            <ProfileIcon type="secondary" />
            <span className="text text_type_main-default text_color_inactive">Личный кабинет</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
