import { useEffect, useState } from "react";

import useAuthStore from "../../stores/authStore";

import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../../api/usersApi";

/*
  AdminUsersTable komponentas.

  Admin gali:
  - matyti visus vartotojus;
  - pakeisti vartotojo rolę;
  - ištrinti vartotoją.

  Backend apsauga:
  - /api/users routes saugomi su protect + restrictTo("admin").
*/

const AdminUsersTable = () => {
  const { user: currentUser } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getUsers();

      setUsers(response.data.users);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch users";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      setError("");

      const response = await updateUserRole(id, { role });
      const updatedUser = response.data.user;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update user role";

      setError(message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Ar tikrai norite ištrinti šį vartotoją?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteUser(id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== Number(id))
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete user";

      setError(message);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Vartotojai
          </h2>

          <p className="text-sm text-gray-600">
            Čia admin gali valdyti vartotojų roles.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {users.length} vartotojai
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-600">
          Kraunami vartotojai...
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Vardas</th>
                <th className="py-3 pr-4">El. paštas</th>
                <th className="py-3 pr-4">Rolė</th>
                <th className="py-3 pr-4">Veiksmai</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isCurrentUser = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-gray-600">
                      {user.id}
                    </td>

                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-2 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                          Jūs
                        </span>
                      )}
                    </td>

                    <td className="py-3 pr-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="py-3 pr-4">
                      <select
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(user.id, event.target.value)
                        }
                        disabled={isCurrentUser}
                        className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>

                    <td className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        disabled={isCurrentUser}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Ištrinti
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Vartotojų nėra.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersTable;