import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { logout, updateUser } from '../../services/authSlice';
import styles from './ProfilePage.module.css';
import { useForm } from '../../hooks/useForm';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  const { values, handleChange, setValues } = useForm({ name: '', email: '', password: '' });
  const [isChanged, setIsChanged] = useState(false);

  // Инициализация значений формы при загрузке user
  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user, setValues]);

  // Проверка, изменились ли данные
  useEffect(() => {
    if (user) {
      const nameChanged = values.name !== user.name;
      const emailChanged = values.email !== user.email;
      const passwordChanged = values.password !== '';
      setIsChanged(nameChanged || emailChanged || passwordChanged);
    }
  }, [values, user]);

  const handleLogout = () => {
    dispatch(logout()).then(() => navigate('/login'));
  };

  const handleCancel = () => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {};
    if (values.name !== user.name) userData.name = values.name;
    if (values.email !== user.email) userData.email = values.email;
    if (values.password) userData.password = values.password;

    dispatch(updateUser(userData)).then((result) => {
      if (result.type === 'auth/updateUser/fulfilled') {
        setValues((prev) => ({ ...prev, password: '' }));
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
                name="name"
                value={values.name}
                onChange={handleChange}
                icon="EditIcon"
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <EmailInput
                placeholder="Логин"
                name="email"
                value={values.email}
                onChange={handleChange}
                isIcon={true}
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <PasswordInput
                placeholder="Пароль"
                name="password"
                value={values.password}
                onChange={handleChange}
                icon="EditIcon"
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
