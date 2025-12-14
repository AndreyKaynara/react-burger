import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import ProtectedRouteElement from './components/ProtectedRouteElement/ProtectedRouteElement';
import ResetPasswordProtection from './components/ResetPasswordProtection/ResetPasswordProtection';
import AppHeader from './components/AppHeader/AppHeader';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import IngredientPage from './pages/IngredientPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OrdersFeedPage from './pages/OrdersFeedPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import OrderDetails from './components/OrderDetails/OrderDetails';
import OrderDetailsModal from './components/OrderDetails/OrderDetailsModal';
import IngredientDetailsModal from './components/IngredientDetails/IngredientDetailsModal';
import { checkAuth } from './services/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchIngredients } from './services/ingredientsSlice';
import { setIngredient, clearIngredient } from './services/ingredientDetailsSlice';
import { useDispatch, useSelector } from './types/store';

function AppRoutes() {
  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/feed" element={<OrdersFeedPage />} />
        <Route path="/feed/:number" element={<OrderDetails />} />
        <Route
          path="/login"
          element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <LoginPage />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <RegisterPage />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <ForgotPasswordPage />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <ResetPasswordProtection>
                <ResetPasswordPage />
              </ResetPasswordProtection>
            </ProtectedRouteElement>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRouteElement>
              <ProfilePage />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRouteElement>
              <OrdersHistoryPage />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRouteElement>
              <OrderDetails />
            </ProtectedRouteElement>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Если есть background - показываем модалку поверх */}
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientDetailsModalRoute />} />
          <Route path="/feed/:number" element={<OrderDetailsModalRoute />} />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRouteElement>
                <OrderDetailsModalRoute />
              </ProtectedRouteElement>
            }
          />
        </Routes>
      )}
    </>
  );
}

// Компонент-обёртка для модального окна ингредиента
function IngredientDetailsModalRoute() {
  const navigate = useNavigate();
  const params = useParams();
  const ingredients = useSelector((state) => state.ingredients.data);
  const selectedIngredient = useSelector((state) => state.ingredientDetails.ingredient);
  const dispatch = useDispatch();

  const ingredientId = params.id;

  useEffect(() => {
    if (ingredientId && ingredients.length > 0) {
      const ingredient = ingredients.find((item) => item._id === ingredientId);
      if (ingredient) {
        dispatch(setIngredient(ingredient));
      }
    }
  }, [ingredientId, ingredients, dispatch]);

  const closeModal = () => {
    dispatch(clearIngredient());
    navigate(-1);
  };

  if (!selectedIngredient) {
    return null;
  }

  return <IngredientDetailsModal onClose={closeModal} />;
}

// Компонент-обёртка для модального окна заказа
function OrderDetailsModalRoute() {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  return <OrderDetailsModal onClose={closeModal} />;
}

function App() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.ingredients.status);
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p className="text text_type_main-medium">Загрузка...</p>
      </div>
    );
  }

  return (
    <Router>
      <AppHeader />
      <div className={styles.app}>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
