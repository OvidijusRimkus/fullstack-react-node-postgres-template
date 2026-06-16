import { useEffect, useState } from "react";

import useAuthStore from "../stores/authStore";
import useCityStore from "../stores/cityStore";
import usePlaceStore from "../stores/placeStore";

import PlaceFilters from "../components/places/PlaceFilters";
import PlaceCard from "../components/places/PlaceCard";
import PlaceDetailsModal from "../components/places/PlaceDetailsModal";
import PlaceForm from "../components/places/PlaceForm";

/*
  PlacesPage.

  Dabar puslapis moka:
  - rodyti vietas;
  - filtruoti;
  - rodyti "Skaityti daugiau";
  - adminui pridėti vietą;
  - adminui redaguoti vietą;
  - adminui ištrinti vietą.
*/

const PlacesPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const { fetchCities } = useCityStore();

  const {
    places,
    isLoading,
    error,
    fetchPlaces,
    fetchPlaceById,
    removePlace,
  } = usePlaceStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  useEffect(() => {
    fetchCities();
    fetchPlaces();
  }, [fetchCities, fetchPlaces]);

  const handleReadMore = async (id) => {
    await fetchPlaceById(id);
  };

  const handleAddClick = () => {
    setEditingPlace(null);
    setIsFormOpen(true);
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setIsFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlace(null);
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setEditingPlace(null);

    /*
      Po create/edit iš naujo parsiunčiam vietas,
      kad sąrašas tikrai sutaptų su DB ir filtrais.
    */
    await fetchPlaces();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Ar tikrai norite ištrinti šią lankytiną vietą?"
    );

    if (!confirmed) return;

    await removePlace(id);
  };

  return (
    <section className="grid gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lankytinos vietos
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Ieškokite ir filtruokite lankytinas vietas pagal miestą, tipą,
              kainą ir įvertinimą.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleAddClick}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Pridėti vietą
            </button>
          )}
        </div>
      </div>

      {isAdmin && isFormOpen && (
        <PlaceForm
          editingPlace={editingPlace}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <PlaceFilters />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
          Kraunamos vietos...
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onReadMore={handleReadMore}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {places.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center text-gray-600 shadow-sm border border-gray-200">
              Lankytinų vietų nerasta.
            </div>
          )}
        </>
      )}

      <PlaceDetailsModal />
    </section>
  );
};

export default PlacesPage;