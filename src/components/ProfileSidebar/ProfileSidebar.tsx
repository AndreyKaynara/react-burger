import React, { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authSlice';
import styles from './ProfileSidebar.module.css';
import { useDispatch } from '../../types/store';

interface ProfileSidebarProps {
  description?: string;
}

const ProfileSidebar: FC<ProfileSidebarProps> = ({ description }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout() as any).then(() => navigate('/login'));
  };

  return (
    <div className={`${styles.sidebar} pr-15`}>
      <nav className="mb-20">
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.navLink} mb-6 text text_type_main-medium${isActive ? '' : ' text_color_inactive'}`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `${styles.navLink} mb-6 text text_type_main-medium${isActive ? '' : ' text_color_inactive'}`
          }
        >
          История заказов
        </NavLink>
        <button
          onClick={handleLogout}
          className={`${styles.logoutButton} text text_type_main-medium text_color_inactive`}
          type="button"
        >
          Выход
        </button>
      </nav>

      {description && <p className="text text_type_main-default text_color_inactive">{description}</p>}
    </div>
  );
};

export default ProfileSidebar;
