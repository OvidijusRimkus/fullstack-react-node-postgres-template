import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import useAuthStore from "../stores/authStore";

/*
  MainLayout komponentas.

  Čia bus bendras puslapio karkasas:
  - header;
  - navigacija;
  - login/logout mygtukai;
  - Outlet, kuriame React Router rodys aktyvų puslapį.
*/

const MainLayout = () => {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuthStore();

  /*
    Logout handleris.

    Paspaudus:
    - kviečiam backend /auth/logout;
    - išvalom Zustand auth state;
    - nukreipiam į login.
  */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /*
    NavLink klasė.

    NavLink leidžia žinoti, kuris linkas aktyvus.
    isActive bus true, jeigu esame tame puslapyje.
  */
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Lankytinos vietos
            </Link>

            <p className="text-sm text-gray-500">
              Miestų ir lankytinų vietų valdymo sistema
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <NavLink to="/" className={getNavLinkClass}>
              Pradžia
            </NavLink>

            <NavLink to="/places" className={getNavLinkClass}>
              Vietos
            </NavLink>

            {user?.role === "admin" && (
              <NavLink to="/admin" className={getNavLinkClass}>
                Admin
              </NavLink>
            )}

            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={getNavLinkClass}>
                  Prisijungti
                </NavLink>

                <NavLink to="/register" className={getNavLinkClass}>
                  Registruotis
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-gray-600">
                  {user?.name} ({user?.role})
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  Atsijungti
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;