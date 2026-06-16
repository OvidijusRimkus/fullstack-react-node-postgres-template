import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "../stores/authStore";

/*
  LoginPage.

  Forma prisijungimui:
  - email
  - password

  Po sėkmingo login:
  - backend įdeda JWT į httpOnly cookie;
  - authStore išsaugo user;
  - nukreipiam į /places arba /admin, jeigu admin.
*/

const LoginPage = () => {
  const navigate = useNavigate();

  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /*
    Bendras input handleris.
  */
  const handleChange = (event) => {
    const { name, value } = event.target;

    clearError();

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
    Submit.
  */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await login(formData);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/places");
      }
    } catch {
      /*
        Klaida jau įrašyta authStore error state,
        todėl čia nieko papildomai daryti nereikia.
      */
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">Prisijungti</h1>

      <p className="mt-2 text-sm text-gray-600">
        Prisijunkite, kad galėtumėte naudoti autorizuotas funkcijas.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-gray-700">
          El. paštas
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="test@test.com"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Slaptažodis
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="******"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Jungiamasi..." : "Prisijungti"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Neturite paskyros?{" "}
        <Link to="/register" className="font-semibold text-blue-600">
          Registruotis
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;