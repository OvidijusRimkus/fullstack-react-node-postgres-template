import useAuthStore from "../../stores/authStore";

/*
  PlaceCard komponentas.

  Vienos lankytinos vietos kortelė.

  Props:
  - place
  - onReadMore
  - onEdit
  - onDelete
*/

const PlaceCard = ({ place, onReadMore, onEdit, onDelete }) => {
  const { user } = useAuthStore();

  const isAdmin = user?.role === "admin";

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
      <img
        src={place.image_url}
        alt={place.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {place.name}
            </h2>

            <p className="text-sm text-gray-500">
              {place.city_name}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {Number(place.rating).toFixed(1)}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          {place.description.length > 120
            ? `${place.description.slice(0, 120)}...`
            : place.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {place.type}
          </span>

          <span
            className={
              place.is_free
                ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                : "rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
            }
          >
            {place.is_free ? "Nemokama" : "Mokama"}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          {place.address}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onReadMore(place.id)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Skaityti daugiau
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => onEdit(place)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Redaguoti
              </button>

              <button
                type="button"
                onClick={() => onDelete(place.id)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Ištrinti
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;