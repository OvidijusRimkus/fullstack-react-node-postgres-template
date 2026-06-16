import useCityStore from "../../stores/cityStore";
import usePlaceStore from "../../stores/placeStore";

/*
  PlaceFilters komponentas.

  Čia valdome filtrus:
  - paieška pagal pavadinimą;
  - miestas;
  - tipas;
  - nemokama / mokama;
  - rating nuo;
  - rating iki.

  Filtrų state laikomas placeStore.js faile.
*/

const PlaceFilters = () => {
  const { cities } = useCityStore();

  const {
    filters,
    setFilter,
    resetFilters,
    fetchPlaces,
    isLoading,
  } = usePlaceStore();

  /*
    Bendras input/select handleris.

    Kiekvienas input turi name:
    search, city_id, type, is_free, rating_min, rating_max
  */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilter(name, value);
  };

  /*
    Submit paspaudus "Filtruoti".

    Tada kviečiam fetchPlaces(),
    kuris paima filtrus iš store ir siunčia į backend query params.
  */
  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetchPlaces();
  };

  /*
    Išvalom filtrus ir iš naujo parsiunčiam visas vietas.
  */
  const handleReset = async () => {
    resetFilters();

    /*
      resetFilters pakeičia state,
      bet React state atsinaujina ne tą pačią milisekundę.
      Todėl čia darom mažą triuką su setTimeout,
      kad fetchPlaces jau naudotų išvalytus filtrus.
    */
    setTimeout(() => {
      fetchPlaces();
    }, 0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Paieška pagal pavadinimą
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Pvz. pilis"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Miestas
          <select
            name="city_id"
            value={filters.city_id}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="">Visi miestai</option>

            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Tipas
          <input
            type="text"
            name="type"
            value={filters.type}
            onChange={handleChange}
            placeholder="Pvz. Pilis, Parkas, Muziejus"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Kaina
          <select
            name="is_free"
            value={filters.is_free}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="">Visos</option>
            <option value="true">Nemokamos</option>
            <option value="false">Mokamos</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Rating nuo
          <input
            type="number"
            name="rating_min"
            value={filters.rating_min}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            placeholder="1"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Rating iki
          <input
            type="number"
            name="rating_max"
            value={filters.rating_max}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            placeholder="5"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Filtruojama..." : "Filtruoti"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Išvalyti
        </button>
      </div>
    </form>
  );
};

export default PlaceFilters;