import usePlaceStore from "../../stores/placeStore";

/*
  PlaceDetailsModal komponentas.

  Rodomas paspaudus "Skaityti daugiau".

  selectedPlace laikomas placeStore.js faile.
*/

const PlaceDetailsModal = () => {
  const {
    selectedPlace,
    clearSelectedPlace,
  } = usePlaceStore();

  /*
    Jeigu nėra pasirinktos vietos, modal nerodom.
  */
  if (!selectedPlace) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <img
          src={selectedPlace.image_url}
          alt={selectedPlace.name}
          className="h-72 w-full object-cover"
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPlace.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedPlace.city_name}
              </p>
            </div>

            <button
              type="button"
              onClick={clearSelectedPlace}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Uždaryti
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              Rating: {Number(selectedPlace.rating).toFixed(1)}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {selectedPlace.type}
            </span>

            <span
              className={
                selectedPlace.is_free
                  ? "rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700"
                  : "rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700"
              }
            >
              {selectedPlace.is_free ? "Nemokama" : "Mokama"}
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Aprašymas
              </h3>

              <p className="mt-2 text-gray-700">
                {selectedPlace.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Adresas
              </h3>

              <p className="mt-2 text-gray-700">
                {selectedPlace.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsModal;