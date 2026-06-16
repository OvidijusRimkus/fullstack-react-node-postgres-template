import { create } from "zustand";

import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../api/placesApi";

/*
  Place store.

  Čia laikysim:
  - places sąrašą;
  - selectedPlace, kai spaudžiam "Skaityti daugiau";
  - filters;
  - loading;
  - error.
*/

const initialFilters = {
  search: "",
  city_id: "",
  type: "",
  is_free: "",
  rating_min: "",
  rating_max: "",
};

const usePlaceStore = create((set, get) => ({
  places: [],
  selectedPlace: null,

  filters: initialFilters,

  isLoading: false,
  error: null,

  clearError: () => {
    set({ error: null });
  },

  clearSelectedPlace: () => {
    set({ selectedPlace: null });
  },

  /*
    Pakeičiam vieną filtrą.

    Pvz:
    setFilter("search", "pilis")
    setFilter("city_id", "1")
  */
  setFilter: (name, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [name]: value,
      },
    }));
  },

  /*
    Išvalom visus filtrus.
  */
  resetFilters: () => {
    set({
      filters: initialFilters,
    });
  },

  /*
    Sutvarkom filtrus prieš siunčiant į API.

    Nenorim siųsti tuščių reikšmių:
    search=
    city_id=
    type=

    Todėl paliekam tik tas reikšmes, kurios tikrai užpildytos.
  */
  getCleanFilters: () => {
    const filters = get().filters;
    const cleanFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        cleanFilters[key] = value;
      }
    });

    return cleanFilters;
  },

  /*
    GET /api/places

    Galima naudoti su filtrais arba be jų.
  */
  fetchPlaces: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const filters = get().getCleanFilters();
      const response = await getPlaces(filters);
      const places = response.data.places;

      set({
        places,
        isLoading: false,
        error: null,
      });

      return places;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch places";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    GET /api/places/:id

    Naudosim "Skaityti daugiau".
  */
  fetchPlaceById: async (id) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await getPlaceById(id);
      const place = response.data.place;

      set({
        selectedPlace: place,
        isLoading: false,
        error: null,
      });

      return place;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch place";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    POST /api/places

    Tik adminui.
  */
  addPlace: async (formData) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await createPlace(formData);
      const place = response.data.place;

      set((state) => ({
        places: [place, ...state.places],
        isLoading: false,
        error: null,
      }));

      return place;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create place";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    PATCH /api/places/:id

    Tik adminui.
  */
  editPlace: async (id, formData) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await updatePlace(id, formData);
      const updatedPlace = response.data.place;

      set((state) => ({
        places: state.places.map((place) =>
          place.id === updatedPlace.id ? updatedPlace : place
        ),
        selectedPlace:
          state.selectedPlace?.id === updatedPlace.id
            ? updatedPlace
            : state.selectedPlace,
        isLoading: false,
        error: null,
      }));

      return updatedPlace;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update place";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
    DELETE /api/places/:id

    Tik adminui.
  */
  removePlace: async (id) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      await deletePlace(id);

      set((state) => ({
        places: state.places.filter((place) => place.id !== Number(id)),
        selectedPlace:
          state.selectedPlace?.id === Number(id)
            ? null
            : state.selectedPlace,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete place";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },
}));

export default usePlaceStore;