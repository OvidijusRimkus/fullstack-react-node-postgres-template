import { Link } from "react-router-dom";

import useAuthStore from "../stores/authStore";

/*
  HomePage.

  Pagrindinis puslapis.
  Čia trumpai pristatom sistemą ir duodam nuorodas į vietas / admin panelę.
*/

const HomePage = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <section className="grid gap-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          React + Node.js + PostgreSQL
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-900">
          Lankytinų vietų sistema
        </h1>

        <p className="mt-4 max-w-3xl text-gray-600">
          Šioje aplikacijoje galima peržiūrėti miestus ir jų lankytinas vietas,
          ieškoti pagal pavadinimą, filtruoti pagal miestą, tipą, kainą ir
          įvertinimą.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/places"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Peržiūrėti vietas
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Prisijungti
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Admin dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900">Miestai</h2>
          <p className="mt-2 text-sm text-gray-600">
            Vienas miestas gali turėti daug lankytinų vietų.
          </p>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900">Lankytinos vietos</h2>
          <p className="mt-2 text-sm text-gray-600">
            Kiekviena vieta turi pavadinimą, tipą, aprašymą, paveikslėlį,
            adresą ir įvertinimą.
          </p>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900">Admin valdymas</h2>
          <p className="mt-2 text-sm text-gray-600">
            Admin vartotojas gali kurti, redaguoti ir trinti miestus bei
            lankytinas vietas.
          </p>
        </article>
      </div>
    </section>
  );
};

export default HomePage;