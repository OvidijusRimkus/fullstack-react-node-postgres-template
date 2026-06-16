import { Navigate } from "react-router-dom";

import useAuthStore from "../stores/authStore";

/*
  AdminRoute komponentas.

  Kam reikalingas?

  Admin puslapiai turi būti matomi tik tada, kai:
  - vartotojas prisijungęs;
  - vartotojo role yra "admin".

  Pvz:

  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminDashboardPage />
      </AdminRoute>
    }
  />
*/

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  /*
    Kol tikrinam auth būseną, rodome loading.
  */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  /*
    Jeigu neprisijungęs, siunčiam į login.
  */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /*
    Jeigu prisijungęs, bet ne admin,
    siunčiam į pagrindinį puslapį.
  */
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  /*
    Jeigu admin, leidžiam matyti puslapį.
  */
  return children;
};

export default AdminRoute;