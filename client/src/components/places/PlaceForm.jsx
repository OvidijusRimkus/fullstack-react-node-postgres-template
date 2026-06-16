import { useEffect, useState } from "react";

import useCityStore from "../../stores/cityStore";
import usePlaceStore from "../../stores/placeStore";

/*
  PlaceForm komponentas.

  Naudosim dviem atvejais:
  - pridėti naują lankytiną vietą;
  - redaguoti esamą lankytiną vietą.

  Props:
  - editingPlace: jeigu yra, forma veikia redagavimo režimu;
  - onClose: uždaryti formą;
  - onSuccess: ką padaryti po sėkmingo išsaugojimo.
*/

const initialFormData = {
  name: "",
  type: "",
  description: "",
  image_url: "",
  address: "",
  rating: "4.5",
  is_free: false,
  city_id: "",
};

const PlaceForm = ({ editingPlace, onClose, onSuccess }) => {
  const { cities } = useCityStore();

  const {
    addPlace,
    editPlace,
    isLoading,
    error,
    clearError,
  } = usePlaceStore();

  const [formData, setFormData] = useState(initialFormData);

  /*
    Jeigu gaunam editingPlace, užpildom formą jo duomenimis.
    Jeigu editingPlace nėra, forma lieka tuščia.
  */
  useEffect(() => {
    if (editingPlace) {
      setFormData({
        name: editingPlace.name || "",
        type: editingPlace.type || "",
        description: editingPlace.description || "",
        image_url: editingPlace.image_url || "",
        address: editingPlace.address || "",
        rating: String(editingPlace.rating || "4.5"),
        is_free: Boolean(editingPlace.is_free),
        city_id: String(editingPlace.city_id || ""),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingPlace]);

  /*
    Bendras input/select/textarea handleris.

    Checkbox atskirai paimam checked reikšmę,
    nes checkbox turi boolean, o ne tekstą.
  */
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    clearError();

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /*
    Prieš siunčiant į backend sutvarkom tipus.

    Frontend input'ai dažnai duoda string:
    rating: "4.8"
    city_id: "3"

    Backend per Zod gali coerce'inti, bet geriau jau čia siųsti tvarkingai:
    rating: 4.8
    city_id: 3
  */
  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      type: formData.type.trim(),
      description: formData.description.trim(),
      image_url: formData.image_url.trim(),
      address: formData.address.trim(),
      rating: Number(formData.rating),
      is_free: Boolean(formData.is_free),
      city_id: Number(formData.city_id),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = buildPayload();

    if (editingPlace) {
      await editPlace(editingPlace.id, payload);
    } else {
      await addPlace(payload);
    }

    setFormData(initialFormData);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {editingPlace ? "Redaguoti lankytiną vietą" : "Pridėti lankytiną vietą"}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Užpildykite informaciją apie lankytiną vietą.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Uždaryti
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Pavadinimas
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Pvz. Trakų pilis"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Tipas
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              minLength={2}
              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Pvz. Pilis, Muziejus, Parkas"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Aprašymas
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            rows={4}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="Trumpas lankytinos vietos aprašymas"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Paveikslėlio URL
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Adresas
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              minLength={3}
              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Pvz. Karaimų g. 43C, Trakai"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Miestas
            <select
              name="city_id"
              value={formData.city_id}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Pasirinkite miestą</option>

              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Įvertinimas
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              min="1"
              max="5"
              step="0.1"
              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_free"
              checked={formData.is_free}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Nemokamas lankymas
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Saugoma..."
              : editingPlace
                ? "Išsaugoti pakeitimus"
                : "Pridėti vietą"}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Atšaukti
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PlaceForm;