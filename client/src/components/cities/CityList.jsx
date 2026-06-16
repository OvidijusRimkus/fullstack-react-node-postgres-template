import CityItem from "./CityItem";

import useCityStore from "../../stores/cityStore";

/*
  CityList komponentas.

  Rodo visus miestus admin dashboarde.

  Props:
  - onEdit
*/

const CityList = ({ onEdit }) => {
  const {
    cities,
    isLoading,
    removeCity,
  } = useCityStore();

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Ar tikrai norite ištrinti šį miestą? Bus ištrintos ir visos šio miesto lankytinos vietos."
    );

    if (!confirmed) return;

    await removeCity(id);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <p className="text-gray-600">Kraunami miestai...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Miestai
          </h2>

          <p className="text-sm text-gray-600">
            Čia galima redaguoti ir trinti miestus.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {cities.length} miestai
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {cities.map((city) => (
          <CityItem
            key={city.id}
            city={city}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}

        {cities.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            Miestų dar nėra.
          </p>
        )}
      </div>
    </div>
  );
};

export default CityList;