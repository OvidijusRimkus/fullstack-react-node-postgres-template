import { create } from "zustand";

import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} from "../api/citiesApi";

/*
  City store.

  Laikysim:
  - cities sąrašą;
  - loading būseną;
  - error žinutę.

  Naudos:
  - Places filtrai;
  - Admin dashboard;
  - CityList;
  - CityForm.
*/

const useCityStore = create((set, get) => ({
  cities: [],
  isLoading: false,
  error: null,

  clearError: () => {
    set({ error: null });
  },

  /*
    GET /api/cities
  */
  fetchCities: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await getCities();
      const cities = response.data.cities;

      set({
        cities,
        isLoading: false,
        error: null,
      });

      return cities;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch cities";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    POST /api/cities

    Tik adminui.
  */
  addCity: async (formData) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await createCity(formData);
      const city = response.data.city;

      set((state) => ({
        cities: [...state.cities, city].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        isLoading: false,
        error: null,
      }));

      return city;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create city";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    PATCH /api/cities/:id

    Tik adminui.
  */
  editCity: async (id, formData) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await updateCity(id, formData);
      const updatedCity = response.data.city;

      set((state) => ({
        cities: state.cities
          .map((city) =>
            city.id === updatedCity.id ? updatedCity : city
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
        isLoading: false,
        error: null,
      }));

      return updatedCity;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update city";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    DELETE /api/cities/:id

    Tik adminui.

    Backend ištrins miestą ir visas susijusias vietas.
  */
  removeCity: async (id) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      await deleteCity(id);

      set((state) => ({
        cities: state.cities.filter((city) => city.id !== Number(id)),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete city";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    Pagalbinė funkcija:
    rasti miestą pagal id iš jau turimo store.
  */
  getCityByIdFromStore: (id) => {
    return get().cities.find((city) => city.id === Number(id));
  },
}));

export default useCityStore;