import { Navigate } from "react-router-dom";

import useAuthStore from "../stores/authStore";

/*
  ProtectedRoute komponentas.

  Kam reikalingas?

  Jeigu puslapis turi būti matomas tik prisijungusiam vartotojui,
  jį apgaubsim su ProtectedRoute.

  Pvz:

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />

  Jei vartotojas neprisijungęs, nukreipsim į /login.
*/

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  /*
    Kol tikrinam auth būseną, rodome paprastą loading tekstą.

    Pvz. App.jsx pradžioje kviesim checkAuth().
    Tuo metu dar nežinom, ar user prisijungęs.
  */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  /*
    Jeigu user neprisijungęs, siunčiam į login puslapį.
  */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /*
    Jeigu prisijungęs, leidžiam matyti vaikinius komponentus.
  */
  return children;
};

export default ProtectedRoute;