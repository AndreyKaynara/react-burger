import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import styles from '../../styles/forms.module.css';
import { Button, EmailInput, PasswordInput, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { register, clearError } from '../../services/authSlice';
import { useForm } from '../../hooks/useForm';
import { useDispatch, useSelector } from '../../types/store';

export default function RegisterPage() {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register(values));
  };

  const isDisabled = !values.name || !values.email || !values.password || isLoading;

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={`${styles.title} text text_type_main-medium mb-6`}>Регистрация</h1>

        {error && <p className={`text text_type_main-default text_color_error mb-4 ${styles.errorMessage}`}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              {...({
                type: 'text',
                placeholder: 'Имя',
                name: 'name',
                value: values.name,
                onChange: handleChange,
              } as any)}
            />
          </div>

          <div className="mb-6">
            <EmailInput placeholder="E-mail" name="email" value={values.email} onChange={handleChange} />
          </div>

          <div className="mb-6">
            <PasswordInput placeholder="Пароль" name="password" value={values.password} onChange={handleChange} />
          </div>

          <div className={`mb-20 ${styles.buttonContainer}`}>
            <Button htmlType="submit" type="primary" size="medium" disabled={isDisabled}>
              {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </Button>
          </div>

          <p className={`${styles.textCenter} text text_type_main-default text_color_inactive`}>
            Уже зарегистрированы?{' '}
            <NavLink to="/login" className={styles.link}>
              Войти
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
