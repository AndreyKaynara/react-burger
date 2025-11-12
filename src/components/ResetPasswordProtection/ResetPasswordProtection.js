import { Navigate, useLocation } from 'react-router-dom';

export default function ResetPasswordProtection({ children }) {
  const location = useLocation();

  // Проверяем, пришёл ли пользователь со страницы forgot-password
  // и передал ли он email через state
  const fromForgotPassword = location.state?.fromForgotPassword;
  const email = location.state?.email;

  if (!fromForgotPassword || !email) {
    // Если пользователь попал сюда напрямую, перенаправляем на forgot-password
    return <Navigate to="/forgot-password" replace />;
  }

  return children;
}
