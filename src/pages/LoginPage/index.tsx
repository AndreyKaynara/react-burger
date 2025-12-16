import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/forms.module.css';
import { Button, EmailInput, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import { login } from '../../services/authSlice';
import { useForm } from '../../hooks/useForm';
import { useDispatch, useSelector } from '../../types/store';

export default function LoginPage() {
  const { values, handleChange } = useForm({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error: loginError, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ email: values.email, password: values.password }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={`text text_type_main-medium mb-6 ${styles.title}`}>Вход</h1>

        {loginError && (
          <p className={`text text_type_main-default text_color_error mb-4 ${styles.errorMessage}`}>{loginError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <EmailInput
              onChange={handleChange}
              value={values.email}
              name="email"
              placeholder="E-mail"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              onChange={handleChange}
              value={values.password}
              name="password"
              placeholder="Пароль"
              disabled={isLoading}
            />
          </div>

          <div className={`mb-20 ${styles.buttonContainer}`}>
            <Button
              htmlType="submit"
              type="primary"
              size="medium"
              disabled={isLoading || !values.email || !values.password}
            >
              {isLoading ? 'Загрузка...' : 'Войти'}
            </Button>
          </div>
        </form>

        <p className={`text text_type_main-default text_color_inactive mb-4 ${styles.textCenter}`}>
          Вы — новый пользователь?{' '}
          <NavLink to="/register" className={styles.link}>
            Зарегистрироваться
          </NavLink>
        </p>

        <p className={`text text_type_main-default text_color_inactive ${styles.textCenter}`}>
          Забыли пароль?{' '}
          <NavLink to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </NavLink>
        </p>
      </div>
    </div>
  );
}
