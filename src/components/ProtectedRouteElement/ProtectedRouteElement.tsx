import React from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import styles from '../../App.module.css';
import { AuthState } from '../../types';

interface ProtectedRouteElementProps {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({ onlyUnAuth = false, children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth as AuthState);
  const location = useLocation();

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p className="text text_type_main-medium">Загрузка...</p>
      </div>
    );
  }

  // Если маршрут только для неавторизованных (login, register и т.д.)
  if (onlyUnAuth && isAuthenticated) {
    // Если пользователь авторизован, перенаправляем на главную
    // Или на страницу, с которой он пришёл (если она была сохранена)
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Если маршрут защищён и пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    // Сохраняем текущий маршрут, чтобы вернуться после авторизации
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если всё в порядке, показываем контент
  return <>{children}</>;
};

export default ProtectedRouteElement;
