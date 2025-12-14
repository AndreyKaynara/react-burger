import React, { useEffect, useState } from 'react';
import { Input, EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { updateUser } from '../../services/authSlice';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import styles from './ProfilePage.module.css';
import { useForm } from '../../hooks/useForm';
import { AuthState, UserRegisterData } from '../../types';
import { useDispatch, useSelector } from '../../types/store';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth) as AuthState;

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

  const handleCancel = () => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const userData: Partial<UserRegisterData> = {};

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
        <ProfileSidebar description="В этом разделе вы можете изменить свои персональные данные" />

        <div className={`${styles.content} pl-15`}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {error && <p className="text text_type_main-default text_color_error mb-4">{error}</p>}

            <div className="mb-6">
              <Input
                {...({
                  type: 'text',
                  placeholder: 'Имя',
                  name: 'name',
                  value: values.name,
                  onChange: handleChange,
                  icon: 'EditIcon',
                  disabled: isLoading,
                } as any)}
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
