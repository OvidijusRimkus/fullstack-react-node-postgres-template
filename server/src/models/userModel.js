const { sql } = require("../db");

/*
  User modelis.

  Modelis atsakingas tik už darbą su duomenų baze.

  Controlleris spręs:
  - ką paimti iš req.body;
  - kokį statusą grąžinti;
  - kokį response išsiųsti.

  Modelis tik vykdo SQL užklausas.
*/

/*
  Sukuriam naują vartotoją.

  password čia jau turi būti užhashintas su bcrypt.
  Hashinimą darys authController.js faile.
*/
const createUser = async ({ name, email, password }) => {
  const users = await sql`
    INSERT INTO users (
      name,
      email,
      password
    )
    VALUES (
      ${name},
      ${email},
      ${password}
    )
    RETURNING
      id,
      name,
      email,
      role,
      created_at
  `;

  return users[0];
};

/*
  Randam vartotoją pagal email.

  Šitą naudosim login metu.

  Čia specialiai grąžinam ir password,
  nes login metu reikės palyginti:
  įvestą slaptažodį su DB saugomu bcrypt hash'u.
*/
const findUserByEmail = async (email) => {
  const users = await sql`
    SELECT
      id,
      name,
      email,
      password,
      role,
      created_at,
      updated_at
    FROM users
    WHERE email = ${email}
  `;

  return users[0];
};

/*
  Randam vartotoją pagal ID.

  Šitą naudosim protect middleware.

  Kai gausim JWT tokeną, iš jo ištrauksim user id,
  tada pagal id patikrinsim ar toks user vis dar egzistuoja DB.
*/
const findUserById = async (id) => {
  const users = await sql`
    SELECT
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM users
    WHERE id = ${id}
  `;

  return users[0];
};

/*
  Admin dashboardui:
  gauti visus vartotojus.

  Slaptažodžio niekada negrąžinam.
*/
const getAllUsers = async () => {
  const users = await sql`
    SELECT
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  return users;
};

/*
  Admin gali pakeisti vartotojo rolę.

  Pvz:
  user -> admin
  admin -> user
*/
const updateUserRole = async (id, role) => {
  const users = await sql`
    UPDATE users
    SET
      role = ${role},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING
      id,
      name,
      email,
      role,
      created_at,
      updated_at
  `;

  return users[0];
};

/*
  Admin gali ištrinti vartotoją.

  Šitam projekte users nėra susieti su places,
  todėl trynimas paprastas.
*/
const deleteUser = async (id) => {
  const users = await sql`
    DELETE FROM users
    WHERE id = ${id}
    RETURNING
      id,
      name,
      email,
      role
  `;

  return users[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUserRole,
  deleteUser,
};