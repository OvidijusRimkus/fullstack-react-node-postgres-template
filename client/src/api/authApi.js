import api from "./axios";

/*
  Auth API funkcijos.

  Šitas failas atsakingas tik už requestus į backend.
  Jokio React state čia nelaikom.

  State bus authStore.js faile.
*/

/*
  POST /api/auth/register

  Data pavyzdys:
  {
    name: "Ovidijus",
    email: "ovidijus@test.com",
    password: "123456"
  }
*/
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

/*
  POST /api/auth/login

  Data pavyzdys:
  {
    email: "ovidijus@test.com",
    password: "123456"
  }

  Backend įdės JWT į httpOnly cookie.
*/
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

/*
  POST /api/auth/logout

  Backend išvalys JWT cookie.
*/
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

/*
  GET /api/auth/me

  Patikrina, ar vartotojas prisijungęs.
  Jeigu cookie galioja, backend grąžins user.
*/
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};