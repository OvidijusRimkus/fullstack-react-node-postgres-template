import { useEffect, useState } from "react";

import { getAdminDashboard } from "../api/adminApi";

import useCityStore from "../stores/cityStore";

import AdminStats from "../components/admin/AdminStats";
import AdminUsersTable from "../components/admin/AdminUsersTable";
import AdminPlacesTable from "../components/admin/AdminPlacesTable";
import AdminDashboardLists from "../components/admin/AdminDashboardLists";

import CityForm from "../components/cities/CityForm";
import CityList from "../components/cities/CityList";

/*
  AdminDashboardPage.

  Admin puslapis:
  - dashboard statistika;
  - vartotojų valdymas;
  - miestų CRUD valdymas;
  - lankytinų vietų lentelė;
  - vietos pagal miestą;
  - vietos pagal tipą;
  - naujausios vietos.
*/

const AdminDashboardPage = () => {
  const { fetchCities } = useCityStore();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [editingCity, setEditingCity] = useState(null);

  const fetchDashboard = async () => {
    try {
      setIsLoadingDashboard(true);
      setDashboardError("");

      const response = await getAdminDashboard();

      setDashboardData(response.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load admin dashboard";

      setDashboardError(message);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchCities();
  }, [fetchCities]);

  const handleEditCity = (city) => {
    setEditingCity(city);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCityFormSuccess = async () => {
    setEditingCity(null);

    await fetchDashboard();
    await fetchCities();
  };

  const handleCancelCityEdit = () => {
    setEditingCity(null);
  };

  /*
    Kai admin lentelėje ištrinama vieta,
    atnaujinam dashboard statistiką.
  */
  const handleAdminPlacesChange = async () => {
    await fetchDashboard();
  };

  if (isLoadingDashboard) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <p className="text-gray-600">
          Kraunamas admin dashboard...
        </p>
      </section>
    );
  }

  if (dashboardError) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin dashboard
        </h1>

        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {dashboardError}
        </div>
      </section>
    );
  }

  const stats = dashboardData?.stats;
  const placesByCity = dashboardData?.placesByCity || [];
  const placesByType = dashboardData?.placesByType || [];
  const latestPlaces = dashboardData?.latestPlaces || [];

  return (
    <section className="grid gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Čia matoma bendra sistemos statistika, vartotojų valdymas,
          miestų administravimas ir lankytinų vietų lentelė.
        </p>
      </div>

      <AdminStats stats={stats} />

      <AdminUsersTable />

      <CityForm
        editingCity={editingCity}
        onSuccess={handleCityFormSuccess}
        onCancel={handleCancelCityEdit}
      />

      <CityList onEdit={handleEditCity} />

      <AdminPlacesTable onDataChange={handleAdminPlacesChange} />

      <AdminDashboardLists
        placesByCity={placesByCity}
        placesByType={placesByType}
      />

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          Naujausios lankytinos vietos
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3 pr-4">Pavadinimas</th>
                <th className="py-3 pr-4">Miestas</th>
                <th className="py-3 pr-4">Tipas</th>
                <th className="py-3 pr-4">Reitingas</th>
                <th className="py-3 pr-4">Kaina</th>
              </tr>
            </thead>

            <tbody>
              {latestPlaces.map((place) => (
                <tr key={place.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {place.name}
                  </td>

                  <td className="py-3 pr-4 text-gray-600">
                    {place.city_name}
                  </td>

                  <td className="py-3 pr-4 text-gray-600">
                    {place.type}
                  </td>

                  <td className="py-3 pr-4 text-gray-600">
                    {Number(place.rating).toFixed(1)}
                  </td>

                  <td className="py-3 pr-4 text-gray-600">
                    {place.is_free ? "Nemokama" : "Mokama"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {latestPlaces.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Naujausių vietų nėra.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;