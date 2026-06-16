# Lankytinų vietų sistema

Pilna React + Node.js Express + PostgreSQL aplikacija, skirta miestų ir jų lankytinų vietų valdymui.

## Technologijos

### Frontend

- React
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- httpOnly cookies
- bcryptjs
- cookie-parser
- Zod
- Docker Compose

## Funkcionalumas

### Autorizacija

- Registracija
- Prisijungimas
- Atsijungimas
- JWT saugojimas httpOnly cookie
- Rolės:
  - user
  - admin

### Miestai

Admin vartotojas gali:

- gauti miestų sąrašą
- pridėti miestą
- redaguoti miestą
- ištrinti miestą

Ištrynus miestą, automatiškai ištrinamos ir visos to miesto lankytinos vietos.

### Lankytinos vietos

Admin vartotojas gali:

- pridėti lankytiną vietą
- redaguoti lankytiną vietą
- ištrinti lankytiną vietą

Visi vartotojai gali:

- matyti lankytinų vietų sąrašą
- spausti „Skaityti daugiau“
- ieškoti pagal pavadinimą
- filtruoti pagal miestą
- filtruoti pagal tipą
- filtruoti pagal nemokama / mokama
- filtruoti pagal įvertinimą nuo iki

### Admin dashboard

Admin dashboard rodo:

- vartotojų kiekį
- miestų kiekį
- lankytinų vietų kiekį
- nemokamų vietų kiekį
- mokamų vietų kiekį
- vidutinį įvertinimą
- vartotojų valdymą
- miestų valdymą
- lankytinų vietų lentelę
- vietas pagal miestą
- vietas pagal tipą
- naujausias lankytinas vietas

## Projekto struktūra

```txt
project-root/
  client/
    src/
      api/
      components/
      layouts/
      pages/
      routes/
      stores/

  server/
    src/
      controllers/
      db/
      middlewares/
      models/
      routes/
      utils/
      validations/

  docker-compose.yml
  README.md