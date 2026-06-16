import { useEffect, useState } from "react";

import useCityStore from "../../stores/cityStore";

/*
  CityForm komponentas.

  Naudosim dviem režimais:
  - pridėti naują miestą;
  - redaguoti esamą miestą.

  Props:
  - editingCity: jeigu yra, forma veikia redagavimo režimu;
  - onSuccess: ką daryti po sėkmingo išsaugojimo;
  - onCancel: atšaukti redagavimą.
*/

const CityForm = ({ editingCity, onSuccess, onCancel }) => {
  const {
    addCity,
    editCity,
    isLoading,
    error,
    clearError,
  } = useCityStore();

  const [name, setName] = useState("");

  /*
    Jeigu editingCity yra, įdedam miesto pavadinimą į inputą.
    Jeigu nėra, forma bus tuščia.
  */
  useEffect(() => {
    if (editingCity) {
      setName(editingCity.name);
    } else {
      setName("");
    }
  }, [editingCity]);

  const handleChange = (event) => {
    clearError();
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
    };

    if (editingCity) {
      await editCity(editingCity.id, payload);
    } else {
      await addCity(payload);
    }

    setName("");

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900">
        {editingCity ? "Redaguoti miestą" : "Pridėti miestą"}
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        Miesto pavadinimas turi būti unikalus.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={100}
          placeholder="Pvz. Palanga"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Saugoma..."
            : editingCity
              ? "Išsaugoti"
              : "Pridėti"}
        </button>

        {editingCity && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Atšaukti
          </button>
        )}
      </form>
    </div>
  );
};

export default CityForm;