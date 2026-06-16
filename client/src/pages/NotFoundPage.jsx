import { Link } from "react-router-dom";

/*
  NotFoundPage.

  Rodomas tada, kai vartotojas nueina į neegzistuojantį route.
*/

const NotFoundPage = () => {
  return (
    <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-200">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        404
      </p>

      <h1 className="mt-3 text-3xl font-bold text-gray-900">
        Puslapis nerastas
      </h1>

      <p className="mt-3 text-gray-600">
        Toks puslapis neegzistuoja arba buvo pašalintas.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Grįžti į pradžią
      </Link>
    </section>
  );
};

export default NotFoundPage;