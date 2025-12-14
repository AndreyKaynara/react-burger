import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <NavLink to="/">
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-default ${!isActive ? 'text_color_inactive' : ''}`}>
                  Конструктор
                </span>
              </>
            )}
          </NavLink>

          <NavLink to="/feed">
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-default ${!isActive ? 'text_color_inactive' : ''}`}>
                  Лента заказов
                </span>
              </>
            )}
          </NavLink>
        </div>

        <div className={styles.center}>
          <a href="/">
            <Logo />
          </a>
        </div>

        <div className={styles.right}>
          <NavLink to="/profile">
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-default ${!isActive ? 'text_color_inactive' : ''}`}>
                  Личный кабинет
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
