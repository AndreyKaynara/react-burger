import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/forms.module.css';
import { Button, EmailInput, PasswordInput, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import { register, clearError } from '../../services/authSlice';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ email, password, name }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={`${styles.title} text text_type_main-medium mb-6`}>Регистрация</h1>

        {error && <p className={`text text_type_main-default text_color_error mb-4 ${styles.errorMessage}`}>{error}</p>}

        <div className="mb-6">
          <Input type="text" placeholder="Имя" onChange={(e) => setName(e.target.value)} value={name} name="name" />
        </div>

        <div className="mb-6">
          <EmailInput onChange={(e) => setEmail(e.target.value)} value={email} name="email" placeholder="E-mail" />
        </div>

        <div className="mb-6">
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
            placeholder="Пароль"
          />
        </div>

        <div className={`mb-20 ${styles.buttonContainer}`}>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={isLoading || !name || !email || !password}
          >
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </Button>
        </div>

        <p className={`${styles.textCenter} text text_type_main-default text_color_inactive`}>
          Уже зарегистрированы?{' '}
          <NavLink to="/login" className={styles.link}>
            Войти
          </NavLink>
        </p>
      </div>
    </div>
  );
}
