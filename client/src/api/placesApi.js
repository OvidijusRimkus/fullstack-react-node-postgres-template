import api from "./axios";

/*
  Places API funkcijos.

  Backend routes:
  GET    /api/places
  GET    /api/places/:id
  POST   /api/places
  PATCH  /api/places/:id
  DELETE /api/places/:id

  GET /api/places palaiko filtrus:
  city_id
  type
  is_free
  rating_min
  rating_max
  search
*/

/*
  GET /api/places

  filters pavyzdys:
  {
    search: "pilis",
    city_id: 1,
    type: "Pilis",
    is_free: true,
    rating_min: 4,
    rating_max: 5
  }

  Axios params automatiškai pavers į query string:
  /places?search=pilis&city_id=1
*/
export const getPlaces = async (filters = {}) => {
  const response = await api.get("/places", {
    params: filters,
  });

  return response.data;
};

/*
  GET /api/places/:id

  Naudosim "Skaityti daugiau" funkcijai.
*/
export const getPlaceById = async (id) => {
  const response = await api.get(`/places/${id}`);

  return response.data;
};

/*
  POST /api/places

  Tik adminui.

  Data pavyzdys:
  {
    name: "Trakų pilis",
    type: "Pilis",
    description: "Istorinė pilis Galvės ežero saloje.",
    image_url: "https://example.com/image.jpg",
    address: "Karaimų g. 43C, Trakai",
    rating: 4.8,
    is_free: false,
    city_id: 3
  }
*/
export const createPlace = async (data) => {
  const response = await api.post("/places", data);

  return response.data;
};

/*
  PATCH /api/places/:id

  Tik adminui.

  Kol kas backend update reikalauja visų laukų,
  todėl frontend forma irgi siųs pilną place objektą.
*/
export const updatePlace = async (id, data) => {
  const response = await api.patch(`/places/${id}`, data);

  return response.data;
};

/*
  DELETE /api/places/:id

  Tik adminui.
*/
export const deletePlace = async (id) => {
  const response = await api.delete(`/places/${id}`);

  return response.data;
};