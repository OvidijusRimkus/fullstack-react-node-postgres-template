/*
  CityItem komponentas.

  Viena miesto eilutė admin sąraše.

  Props:
  - city
  - onEdit
  - onDelete
*/

const CityItem = ({ city, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-bold text-gray-900">
          {city.name}
        </h3>

        <p className="text-sm text-gray-500">
          Lankytinų vietų: {city.places_count ?? 0}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit(city)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          Redaguoti
        </button>

        <button
          type="button"
          onClick={() => onDelete(city.id)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Ištrinti
        </button>
      </div>
    </div>
  );
};

export default CityItem;