const { sql } = require("../db");

/*
  City modelis.

  Atsakingas už cities lentelės CRUD.

  Lentelė:
  cities
  - id
  - name
  - created_at
  - updated_at
*/

/*
  Gauti visus miestus.

  Papildomai paskaičiuojam, kiek kiekvienas miestas turi lankytinų vietų.

  LEFT JOIN reiškia:
  rodyk miestą net tada, jeigu jis dar neturi nei vienos vietos.
*/
const getAllCities = async () => {
  const cities = await sql`
    SELECT
      cities.id,
      cities.name,
      cities.created_at,
      cities.updated_at,
      COUNT(places.id)::int AS places_count
    FROM cities
    LEFT JOIN places
      ON places.city_id = cities.id
    GROUP BY cities.id
    ORDER BY cities.name ASC
  `;

  return cities;
};

/*
  Gauti vieną miestą pagal id.

  Naudosim:
  GET /api/cities/:id
*/
const getCityById = async (id) => {
  const cities = await sql`
    SELECT
      id,
      name,
      created_at,
      updated_at
    FROM cities
    WHERE id = ${id}
  `;

  return cities[0];
};

/*
  Sukurti naują miestą.

  Naudosim:
  POST /api/cities

  Šitas route bus tik adminui.
*/
const createCity = async ({ name }) => {
  const cities = await sql`
    INSERT INTO cities (
      name
    )
    VALUES (
      ${name}
    )
    RETURNING
      id,
      name,
      created_at,
      updated_at
  `;

  return cities[0];
};

/*
  Atnaujinti miestą.

  Naudosim:
  PATCH /api/cities/:id

  Šitas route bus tik adminui.
*/
const updateCity = async (id, { name }) => {
  const cities = await sql`
    UPDATE cities
    SET
      name = ${name},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING
      id,
      name,
      created_at,
      updated_at
  `;

  return cities[0];
};

/*
  Ištrinti miestą.

  Naudosim:
  DELETE /api/cities/:id

  Kadangi places lentelėje city_id turi:
  ON DELETE CASCADE

  Tai ištrynus miestą automatiškai išsitrins
  ir visos to miesto lankytinos vietos.
*/
const deleteCity = async (id) => {
  const cities = await sql`
    DELETE FROM cities
    WHERE id = ${id}
    RETURNING
      id,
      name
  `;

  return cities[0];
};

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};