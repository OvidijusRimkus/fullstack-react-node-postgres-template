/*
  AdminDashboardLists komponentas.

  Čia iškeliame dvi mažas dashboard lenteles:
  - vietos pagal miestą;
  - vietos pagal tipą.

  Taip AdminDashboardPage bus trumpesnis ir tvarkingesnis.
*/

const AdminDashboardLists = ({ placesByCity, placesByType }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          Vietos pagal miestą
        </h2>

        <div className="mt-4 grid gap-3">
          {placesByCity.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm"
            >
              <span className="font-medium text-gray-700">
                {city.name}
              </span>

              <span className="text-gray-500">
                {city.places_count}
              </span>
            </div>
          ))}

          {placesByCity.length === 0 && (
            <p className="text-sm text-gray-500">
              Duomenų nėra.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          Vietos pagal tipą
        </h2>

        <div className="mt-4 grid gap-3">
          {placesByType.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm"
            >
              <span className="font-medium text-gray-700">
                {item.type}
              </span>

              <span className="text-gray-500">
                {item.places_count}
              </span>
            </div>
          ))}

          {placesByType.length === 0 && (
            <p className="text-sm text-gray-500">
              Duomenų nėra.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLists;