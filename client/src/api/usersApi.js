import api from "./axios";

/*
  Users API funkcijos.

  Šitos funkcijos bus naudojamos admin dashboarde.

  Backend routes:
  GET    /api/users
  GET    /api/users/:id
  PATCH  /api/users/:id/role
  DELETE /api/users/:id

  Visi šitie routes reikalauja:
  - prisijungusio vartotojo;
  - admin rolės.
*/

/*
  GET /api/users

  Grąžina visus vartotojus.
*/
export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

/*
  GET /api/users/:id

  Grąžina vieną vartotoją.
*/
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);

  return response.data;
};

/*
  PATCH /api/users/:id/role

  Data pavyzdys:
  {
    role: "admin"
  }

  arba:
  {
    role: "user"
  }
*/
export const updateUserRole = async (id, data) => {
  const response = await api.patch(`/users/${id}/role`, data);

  return response.data;
};

/*
  DELETE /api/users/:id

  Ištrina vartotoją.
  Backend neleidžia adminui ištrinti savo paskyros.
*/
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);

  return response.data;
};