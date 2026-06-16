const postgres = require("postgres");
const dotenv = require("dotenv");

// Užkraunam .env failą, kad galėtume naudoti process.env
dotenv.config();

/*
  Sukuriam PostgreSQL prisijungimą.

  Naudojam "postgres" biblioteką.
  Ji leidžia rašyti SQL taip:

  const users = await sql`SELECT * FROM users`;

  Šitą sql objektą eksportuosim ir naudosim modeliuose:
  userModel.js
  cityModel.js
  placeModel.js
*/
const sql = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Maksimalus vienu metu aktyvių DB prisijungimų kiekis
  max: 10,

  // Kiek sekundžių laukti bandant prisijungti prie DB
  connect_timeout: 10,

  // Po kiek sekundžių nenaudojamas prisijungimas gali būti uždaromas
  idle_timeout: 20,
});

/*
  DB prisijungimo testavimo funkcija.

  Ją panaudosim /api/health endpoint'e, kad galėtume greitai patikrinti:
  ar serveris veikia;
  ar duomenų bazė pasiekiama.
*/
const testConnection = async () => {
  const result = await sql`
    SELECT NOW() AS current_time
  `;

  return result[0];
};

module.exports = {
  sql,
  testConnection,
};