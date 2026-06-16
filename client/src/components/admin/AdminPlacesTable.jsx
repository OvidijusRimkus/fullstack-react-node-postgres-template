import { useEffect, useState } from "react";

import {
  getPlaces,
  deletePlace,
} from "../../api/placesApi";

/*
  AdminPlacesTable komponentas.

  Admin dashboarde rodysime visas lankytinas vietas lentelėje.

  Admin galės:
  - matyti pavadinimą;
  - miestą;
  - tipą;
  - reitingą;
  - ar vieta nemokama;
  - ištrinti vietą.

  Redagavimą jau turime /places puslapyje, todėl čia kol kas darome tik delete.
*/

const AdminPlacesTable = ({ onDataChange }) => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaces = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getPlaces();

      setPlaces(response.data.places);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch places";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Ar tikrai norite ištrinti šią lankytiną vietą?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deletePlace(id);

      setPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place.id !== Number(id))
      );

      /*
        Pranešam tėviniam komponentui,
        kad reikia atnaujinti dashboard statistiką.
      */
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete place";

      setError(message);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Lankytinos vietos
          </h2>

          <p className="text-sm text-gray-600">
            Visų lankytinų vietų administravimo lentelė.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {places.length} vietos
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-600">
          Kraunamos lankytinos vietos...
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Pavadinimas</th>
                <th className="py-3 pr-4">Miestas</th>
                <th className="py-3 pr-4">Tipas</th>
                <th className="py-3 pr-4">Reitingas</th>
                <th className="py-3 pr-4">Kaina</th>
                <th className="py-3 pr-4">Veiksmai</th>
              </tr>
            </thead>

            <tbody>
              {places.map((place) => (
                <tr key={place.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-600">
                    {place.id}
                  </td>

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

                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(place.id)}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Ištrinti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {places.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Lankytinų vietų nėra.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPlacesTable;