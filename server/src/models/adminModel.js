const { sql } = require("../db");

/*
  Admin modelis.

  Čia laikysim užklausas admin dashboardui:
  - kiek yra vartotojų;
  - kiek miestų;
  - kiek lankytinų vietų;
  - kiek nemokamų / mokamų vietų;
  - vidutinis įvertinimas;
  - vietų kiekis pagal miestą;
  - vietų kiekis pagal tipą.
*/

/*
  Pagrindinė dashboard statistika.
*/
const getDashboardStats = async () => {
  const result = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS users_count,
      (SELECT COUNT(*)::int FROM cities) AS cities_count,
      (SELECT COUNT(*)::int FROM places) AS places_count,
      (SELECT COUNT(*)::int FROM places WHERE is_free = true) AS free_places_count,
      (SELECT COUNT(*)::int FROM places WHERE is_free = false) AS paid_places_count,
      COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM places), 0) AS average_rating
  `;

  return {
    ...result[0],
    average_rating: Number(result[0].average_rating),
  };
};

/*
  Kiek lankytinų vietų turi kiekvienas miestas.

  Naudosim admin dashboard lentelėms arba grafikams.
*/
const getPlacesCountByCity = async () => {
  const rows = await sql`
    SELECT
      cities.id,
      cities.name,
      COUNT(places.id)::int AS places_count
    FROM cities
    LEFT JOIN places
      ON places.city_id = cities.id
    GROUP BY cities.id
    ORDER BY places_count DESC, cities.name ASC
  `;

  return rows;
};

/*
  Kiek vietų yra pagal tipą.

  Pvz:
  Parkas - 3
  Pilis - 2
  Muziejus - 1
*/
const getPlacesCountByType = async () => {
  const rows = await sql`
    SELECT
      type,
      COUNT(*)::int AS places_count
    FROM places
    GROUP BY type
    ORDER BY places_count DESC, type ASC
  `;

  return rows;
};

/*
  Naujausios įkeltos lankytinos vietos.

  Admin dashboarde galėsim rodyti paskutinius įrašus.
*/
const getLatestPlaces = async () => {
  const places = await sql`
    SELECT
      places.id,
      places.name,
      places.type,
      places.rating,
      places.is_free,
      places.city_id,
      cities.name AS city_name,
      places.created_at
    FROM places
    INNER JOIN cities
      ON cities.id = places.city_id
    ORDER BY places.created_at DESC
    LIMIT 5
  `;

  return places.map((place) => ({
    ...place,
    rating: Number(place.rating),
  }));
};

module.exports = {
  getDashboardStats,
  getPlacesCountByCity,
  getPlacesCountByType,
  getLatestPlaces,
};