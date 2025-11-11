import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/forms.module.css';
import { Button, PasswordInput, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import { API_SERVER_URL } from '../../utils/api/api';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_SERVER_URL}/password-reset/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          token: code,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // После успешного сброса пароля переходим на страницу входа
        navigate('/login', { replace: true });
      } else {
        setError(data.message || 'Ошибка при сбросе пароля');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={`${styles.title} text text_type_main-medium mb-6`}>Восстановление пароля</h1>

        {error && <p className={`text text_type_main-default text_color_error mb-4 ${styles.errorMessage}`}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              placeholder="Введите новый пароль"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder="Введите код из письма"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              name="code"
              disabled={isLoading}
            />
          </div>

          <div className={`mb-20 ${styles.buttonContainer}`}>
            <Button htmlType="submit" type="primary" size="medium" disabled={isLoading || !password || !code}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>

        <p className={`${styles.textCenter} text text_type_main-default text_color_inactive`}>
          Вспомнили пароль?{' '}
          <NavLink to="/login" className={styles.link}>
            Войти
          </NavLink>
        </p>
      </div>
    </div>
  );
}
