import api from "./axios";

/*
  Cities API funkcijos.

  Backend routes:
  GET    /api/cities
  GET    /api/cities/:id
  POST   /api/cities
  PATCH  /api/cities/:id
  DELETE /api/cities/:id

  POST, PATCH, DELETE veiks tik adminui.
*/

/*
  GET /api/cities

  Grąžina visus miestus.
*/
export const getCities = async () => {
  const response = await api.get("/cities");

  return response.data;
};

/*
  GET /api/cities/:id

  Grąžina vieną miestą pagal id.
*/
export const getCityById = async (id) => {
  const response = await api.get(`/cities/${id}`);

  return response.data;
};

/*
  POST /api/cities

  Data pavyzdys:
  {
    name: "Palanga"
  }
*/
export const createCity = async (data) => {
  const response = await api.post("/cities", data);

  return response.data;
};

/*
  PATCH /api/cities/:id

  Data pavyzdys:
  {
    name: "Vilnius updated"
  }
*/
export const updateCity = async (id, data) => {
  const response = await api.patch(`/cities/${id}`, data);

  return response.data;
};

/*
  DELETE /api/cities/:id

  Ištrina miestą.
  Kadangi backend DB turi ON DELETE CASCADE,
  kartu išsitrins ir to miesto lankytinos vietos.
*/
export const deleteCity = async (id) => {
  const response = await api.delete(`/cities/${id}`);

  return response.data;
};