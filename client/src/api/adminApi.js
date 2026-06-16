import api from "./axios";

/*
  Admin API funkcijos.

  Backend route:
  GET /api/admin/dashboard

  Grąžina:
  - users count;
  - cities count;
  - places count;
  - free/paid places count;
  - average rating;
  - places by city;
  - places by type;
  - latest places.
*/

/*
  GET /api/admin/dashboard

  Tik adminui.
*/
export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};