import axios from "axios";

/*
  Bendras axios instance visam frontendui.

  Kam reikalingas?
  Vietoj to, kad kiekviename faile rašytume:
  axios.get("http://localhost:3000/api/...")

  Rašysim trumpiau:
  api.get("/auth/me")
  api.get("/cities")
  api.post("/places", data)
*/

const api = axios.create({
  /*
    Backend adresas.

    Kadangi backend pas mus veikia:
    http://localhost:3000

    O visi routes prasideda nuo:
    /api

    Todėl baseURL:
    http://localhost:3000/api
  */
  baseURL: "http://localhost:3000/api",

  /*
    Labai svarbu auth sistemai su cookie.

    Kad frontend siųstų JWT cookie į backend,
    reikia withCredentials: true.

    Be šito:
    - login cookie gali būti gautas;
    - bet kiti requestai jo nesiųs;
    - tada /auth/me, /admin/dashboard ir kiti protected routes neveiks.
  */
  withCredentials: true,
});

/*
  Response interceptor.

  Jeigu backend grąžina klaidą, čia galim ją suvienodinti.

  Pvz. backend klaida:
  {
    "status": "fail",
    "message": "Incorrect email or password"
  }

  Tada frontend galės paprastai naudoti:
  error.response?.data?.message
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;