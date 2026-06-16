import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import useAuthStore from "./stores/authStore";

import MainLayout from "./layouts/MainLayout";
import AdminRoute from "./routes/AdminRoute";

import HomePage from "./pages/HomePage";
import PlacesPage from "./pages/PlacesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

/*
  App.jsx yra pagrindinis React aplikacijos routeris.

  Čia:
  - paleidžiam checkAuth, kad po refresh išliktų prisijungimas;
  - aprašom visus puslapių routes;
  - admin puslapį saugom su AdminRoute.
*/

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  /*
    Kai aplikacija pirmą kartą užsikrauna,
    patikrinam ar naršyklėje yra galiojantis JWT cookie.

    Jeigu yra:
    - backend /auth/me grąžins user;
    - Zustand store nustatys isAuthenticated true.

    Jeigu nėra:
    - checkAuth tyliai grąžins null.
  */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/places" element={<PlacesPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;