import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import styles from '../../styles/forms.module.css';
import { Button, EmailInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { API_SERVER_URL } from '../../api/api';
import { useForm } from '../../hooks/useForm';

export default function ForgotPasswordPage() {
  const { values, handleChange } = useForm({ email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_SERVER_URL}/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigate('/reset-password', {
          state: { fromForgotPassword: true, email: values.email },
          replace: true,
        });
      } else {
        setError(data.message || 'Ошибка при отправке запроса');
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
            <EmailInput
              name="email"
              placeholder="Укажите e-mail"
              value={values.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={`mb-20 ${styles.buttonContainer}`}>
            <Button htmlType="submit" type="primary" size="medium" disabled={isLoading || !values.email}>
              {isLoading ? 'Отправка...' : 'Восстановить'}
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
