/*
  Šitas failas sukuria visas projekto lenteles.

  Turėsim 3 lenteles:

  users  - autorizacijai / admin dashboardui
  cities - miestams
  places - lankytinoms vietoms

  Ryšys:
  cities 1 ─── * places

  ON DELETE CASCADE reiškia:
  jeigu ištrinam miestą, automatiškai išsitrina ir visos to miesto vietos.
*/

DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  name VARCHAR(100) NOT NULL,

  email VARCHAR(150) NOT NULL UNIQUE,

  /*
    Čia saugosim ne paprastą slaptažodį,
    o bcrypt hash'ą.
  */
  password VARCHAR(255) NOT NULL,

  /*
    role naudosim admin apsaugai.

    Paprastas vartotojas:
    user

    Administratorius:
    admin
  */
  role VARCHAR(20) NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin')),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,

  /*
    Miesto pavadinimas turi būti privalomas.
    UNIQUE reiškia, kad negalėsim turėti dviejų tokių pačių miestų.
  */
  name VARCHAR(100) NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE places (
  id SERIAL PRIMARY KEY,

  name VARCHAR(150) NOT NULL,

  /*
    Tipas, pvz:
    Pilis
    Muziejus
    Parkas
    Istorinis objektas
  */
  type VARCHAR(100) NOT NULL,

  description TEXT NOT NULL,

  /*
    Minimalus reikalavimas pagal užduotį:
    saugom paveikslėlio URL.
  */
  image_url TEXT NOT NULL,

  address VARCHAR(255) NOT NULL,

  /*
    NUMERIC(2,1) leidžia turėti skaičius kaip:
    1.0
    4.8
    5.0

    CHECK užtikrina intervalą nuo 1 iki 5.
  */
  rating NUMERIC(2,1) NOT NULL
    CHECK (rating >= 1 AND rating <= 5),

  /*
    true  - nemokama
    false - mokama
  */
  is_free BOOLEAN NOT NULL DEFAULT false,

  /*
    Ryšys su cities lentele.

    Jeigu city_id = 1, reiškia vieta priklauso miestui,
    kurio id yra 1.
  */
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
  Indeksai pagreitina filtravimą / paiešką.

  Nebūtina mažam projektui, bet geras įprotis.
*/
CREATE INDEX idx_places_city_id ON places(city_id);
CREATE INDEX idx_places_type ON places(type);
CREATE INDEX idx_places_is_free ON places(is_free);
CREATE INDEX idx_places_rating ON places(rating);
CREATE INDEX idx_places_name ON places(name);