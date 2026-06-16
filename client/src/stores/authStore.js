import { create } from "zustand";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../api/authApi";

/*
  Auth store.

  Čia laikysim prisijungusio vartotojo informaciją:
  - user
  - isAuthenticated
  - isLoading
  - error

  Šitą store naudos:
  - LoginPage
  - RegisterPage
  - ProtectedRoute
  - AdminRoute
  - MainLayout
*/

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /*
    Išvalom klaidą.
    Naudinga kai pereinam į kitą formą arba pradedam naują veiksmą.
  */
  clearError: () => {
    set({ error: null });
  },

  /*
    Register funkcija.

    Kvies:
    POST /api/auth/register

    Backend:
    - sukurs user;
    - įdės JWT į httpOnly cookie;
    - grąžins user objektą.
  */
  register: async (formData) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await registerUser(formData);
      const user = response.data.user;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    Login funkcija.

    Kvies:
    POST /api/auth/login
  */
  login: async (formData) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await loginUser(formData);
      const user = response.data.user;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    Logout funkcija.

    Kvies:
    POST /api/auth/logout

    Backend išvalys cookie,
    frontend išvalys user state.
  */
  logout: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      await logoutUser();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Logout failed";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    checkAuth funkcija.

    Ją kviesim App.jsx pradžioje.
    Tikslas:
    - jeigu vartotojas turi galiojančią JWT cookie,
      automatiškai atstatyti prisijungimą po refresh.
  */
  checkAuth: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await getCurrentUser();
      const user = response.data.user;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return null;
    }
  },
}));

export default useAuthStore;