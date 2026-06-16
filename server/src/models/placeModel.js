const { sql } = require("../db");

/*
  Place modelis.

  Atsakingas už places lentelės CRUD + filtravimą + paiešką.

  Lentelė:
  places
  - id
  - name
  - type
  - description
  - image_url
  - address
  - rating
  - is_free
  - city_id
  - created_at
  - updated_at
*/

/*
  Pagalbinė funkcija, kuri sutvarko rating.

  PostgreSQL NUMERIC reikšmes dažnai grąžina kaip string.
  Pvz. "4.8"

  Frontendui patogiau turėti number.
*/
const mapPlace = (place) => {
  if (!place) return place;

  return {
    ...place,
    rating: Number(place.rating),
  };
};

/*
  Gauti visas lankytinas vietas.

  Čia palaikom filtrus:

  city_id
  type
  is_free
  rating_min
  rating_max
  search

  Pvz:
  /api/places?city_id=1&type=Parkas&is_free=true&rating_min=4&rating_max=5&search=pilis
*/
const getAllPlaces = async (filters = {}) => {
  const {
    city_id,
    type,
    is_free,
    rating_min,
    rating_max,
    search,
  } = filters;

  /*
    Čia darom dinaminį filtravimą saugiai su postgres biblioteka.

    Kiekvieną filtrą pridedam tik tada,
    jeigu jis tikrai buvo atsiųstas.
  */
  const conditions = [];

  if (city_id !== undefined) {
    conditions.push(sql`places.city_id = ${city_id}`);
  }

  if (type !== undefined) {
    conditions.push(sql`places.type = ${type}`);
  }

  if (is_free !== undefined) {
    conditions.push(sql`places.is_free = ${is_free}`);
  }

  if (rating_min !== undefined) {
    conditions.push(sql`places.rating >= ${rating_min}`);
  }

  if (rating_max !== undefined) {
    conditions.push(sql`places.rating <= ${rating_max}`);
  }

  if (search !== undefined) {
    conditions.push(sql`places.name ILIKE ${`%${search}%`}`);
  }

  /*
    Jeigu filtrų nėra, WHERE dalies nededam.

    Jeigu yra, sujungiam su AND.
  */
  const whereClause =
    conditions.length > 0
      ? sql`WHERE ${conditions.reduce((prev, condition, index) => {
          if (index === 0) return condition;
          return sql`${prev} AND ${condition}`;
        })}`
      : sql``;

  const places = await sql`
    SELECT
      places.id,
      places.name,
      places.type,
      places.description,
      places.image_url,
      places.address,
      places.rating,
      places.is_free,
      places.city_id,
      cities.name AS city_name,
      places.created_at,
      places.updated_at
    FROM places
    INNER JOIN cities
      ON cities.id = places.city_id
    ${whereClause}
    ORDER BY places.created_at DESC
  `;

  return places.map(mapPlace);
};

/*
  Gauti vieną lankytiną vietą pagal id.

  Naudosim:
  GET /api/places/:id

  Čia taip pat prijungiam miesto pavadinimą.
*/
const getPlaceById = async (id) => {
  const places = await sql`
    SELECT
      places.id,
      places.name,
      places.type,
      places.description,
      places.image_url,
      places.address,
      places.rating,
      places.is_free,
      places.city_id,
      cities.name AS city_name,
      places.created_at,
      places.updated_at
    FROM places
    INNER JOIN cities
      ON cities.id = places.city_id
    WHERE places.id = ${id}
  `;

  return mapPlace(places[0]);
};

/*
  Sukurti naują lankytiną vietą.

  Naudosim:
  POST /api/places

  Šitas route bus tik adminui.
*/
const createPlace = async ({
  name,
  type,
  description,
  image_url,
  address,
  rating,
  is_free,
  city_id,
}) => {
  const places = await sql`
    INSERT INTO places (
      name,
      type,
      description,
      image_url,
      address,
      rating,
      is_free,
      city_id
    )
    VALUES (
      ${name},
      ${type},
      ${description},
      ${image_url},
      ${address},
      ${rating},
      ${is_free},
      ${city_id}
    )
    RETURNING
      id,
      name,
      type,
      description,
      image_url,
      address,
      rating,
      is_free,
      city_id,
      created_at,
      updated_at
  `;

  return mapPlace(places[0]);
};

/*
  Atnaujinti lankytiną vietą.

  Naudosim:
  PATCH /api/places/:id

  Šitas route bus tik adminui.
*/
const updatePlace = async (
  id,
  {
    name,
    type,
    description,
    image_url,
    address,
    rating,
    is_free,
    city_id,
  }
) => {
  const places = await sql`
    UPDATE places
    SET
      name = ${name},
      type = ${type},
      description = ${description},
      image_url = ${image_url},
      address = ${address},
      rating = ${rating},
      is_free = ${is_free},
      city_id = ${city_id},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING
      id,
      name,
      type,
      description,
      image_url,
      address,
      rating,
      is_free,
      city_id,
      created_at,
      updated_at
  `;

  return mapPlace(places[0]);
};

/*
  Ištrinti lankytiną vietą.

  Naudosim:
  DELETE /api/places/:id

  Šitas route bus tik adminui.
*/
const deletePlace = async (id) => {
  const places = await sql`
    DELETE FROM places
    WHERE id = ${id}
    RETURNING
      id,
      name,
      type,
      city_id
  `;

  return places[0];
};

module.exports = {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};