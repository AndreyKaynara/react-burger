import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { logout, updateUser } from '../../services/authSlice';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword('');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const nameChanged = name !== user.name;
      const emailChanged = email !== user.email;
      const passwordChanged = password !== '';

      setIsChanged(nameChanged || emailChanged || passwordChanged);
    }
  }, [name, email, password, user]);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/login');
    });
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword('');
    }
    dispatch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {};

    if (name !== user.name) {
      userData.name = name;
    }
    if (email !== user.email) {
      userData.email = email;
    }
    if (password) {
      userData.password = password;
    }

    dispatch(updateUser(userData)).then((result) => {
      if (result.type === 'auth/updateUser/fulfilled') {
        setPassword('');
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

          <p className="text text_type_main-default text_color_inactive">
            В этом разделе вы можете изменить свои персональные данные
          </p>
        </div>

        <div className={`${styles.content} pl-15`}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {error && <p className="text text_type_main-default text_color_error mb-4">{error}</p>}

            <div className="mb-6">
              <Input
                type="text"
                placeholder="Имя"
                onChange={(e) => setName(e.target.value)}
                value={name}
                name="name"
                icon="EditIcon"
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <EmailInput
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                placeholder="Логин"
                isIcon={true}
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name="password"
                icon="EditIcon"
                placeholder="Пароль"
                disabled={isLoading}
              />
            </div>

            {isChanged && (
              <div className={styles.buttonGroup}>
                <Button htmlType="button" type="secondary" size="medium" onClick={handleCancel} disabled={isLoading}>
                  Отмена
                </Button>
                <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
