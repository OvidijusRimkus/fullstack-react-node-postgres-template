const { z } = require("zod");

/*
  Place validacijos.

  Places CRUD:
  GET    /api/places
  GET    /api/places/:id
  POST   /api/places
  PATCH  /api/places/:id
  DELETE /api/places/:id

  Taip pat GET /api/places turės query filtrus:
  city_id
  type
  is_free
  rating_min
  rating_max
  search
*/

/*
  Parametrų validacija route'ams su :id.

  Pvz:
  /api/places/3
*/
const placeIdParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("Place id must be an integer")
      .positive("Place id must be positive"),
  }),
});

/*
  GET /api/places filtrų validacija.

  Pavyzdžiai:
  /api/places?city_id=1
  /api/places?type=Parkas
  /api/places?is_free=true
  /api/places?rating_min=4&rating_max=5
  /api/places?search=pilis

  Visi query parametrai ateina kaip string,
  todėl number ir boolean reikšmes konvertuojam.
*/
const getPlacesQuerySchema = z.object({
  query: z
    .object({
      city_id: z.coerce
        .number()
        .int("City id must be an integer")
        .positive("City id must be positive")
        .optional(),

      type: z
        .string()
        .trim()
        .min(1, "Type cannot be empty")
        .max(100, "Type must be less than 100 characters")
        .optional(),

      is_free: z
        .enum(["true", "false"])
        .optional()
        .transform((value) => {
          if (value === undefined) return undefined;
          return value === "true";
        }),

      rating_min: z.coerce
        .number()
        .min(1, "Minimum rating cannot be lower than 1")
        .max(5, "Minimum rating cannot be higher than 5")
        .optional(),

      rating_max: z.coerce
        .number()
        .min(1, "Maximum rating cannot be lower than 1")
        .max(5, "Maximum rating cannot be higher than 5")
        .optional(),

      search: z
        .string()
        .trim()
        .min(1, "Search cannot be empty")
        .max(150, "Search must be less than 150 characters")
        .optional(),
    })
    .refine(
      (query) => {
        if (query.rating_min === undefined || query.rating_max === undefined) {
          return true;
        }

        return query.rating_min <= query.rating_max;
      },
      {
        message: "rating_min cannot be greater than rating_max",
        path: ["rating_min"],
      }
    ),
});

/*
  Lankytinos vietos sukūrimas.

  Tikimės body:
  {
    "name": "Trakų pilis",
    "type": "Pilis",
    "description": "Istorinė pilis saloje",
    "image_url": "https://...",
    "address": "Karaimų g. 43C",
    "rating": 4.8,
    "is_free": false,
    "city_id": 3
  }
*/
const createPlaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Place name must be at least 2 characters long")
      .max(150, "Place name must be less than 150 characters"),

    type: z
      .string()
      .trim()
      .min(2, "Type must be at least 2 characters long")
      .max(100, "Type must be less than 100 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters long"),

    image_url: z
      .string()
      .trim()
      .url("Image URL must be a valid URL"),

    address: z
      .string()
      .trim()
      .min(3, "Address must be at least 3 characters long")
      .max(255, "Address must be less than 255 characters"),

    rating: z.coerce
      .number()
      .min(1, "Rating cannot be lower than 1")
      .max(5, "Rating cannot be higher than 5"),

    is_free: z.boolean({
      message: "is_free must be true or false",
    }),

    city_id: z.coerce
      .number()
      .int("City id must be an integer")
      .positive("City id must be positive"),
  }),
});

/*
  Lankytinos vietos redagavimas.

  Čia kol kas reikalaujam visų laukų kaip ir create,
  kad būtų paprasčiau su frontend forma.

  Vėliau, jeigu norėsim, galėsim padaryti partial update,
  kur leidžiama siųsti tik vieną pakeistą lauką.
*/
const updatePlaceSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("Place id must be an integer")
      .positive("Place id must be positive"),
  }),

  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Place name must be at least 2 characters long")
      .max(150, "Place name must be less than 150 characters"),

    type: z
      .string()
      .trim()
      .min(2, "Type must be at least 2 characters long")
      .max(100, "Type must be less than 100 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters long"),

    image_url: z
      .string()
      .trim()
      .url("Image URL must be a valid URL"),

    address: z
      .string()
      .trim()
      .min(3, "Address must be at least 3 characters long")
      .max(255, "Address must be less than 255 characters"),

    rating: z.coerce
      .number()
      .min(1, "Rating cannot be lower than 1")
      .max(5, "Rating cannot be higher than 5"),

    is_free: z.boolean({
      message: "is_free must be true or false",
    }),

    city_id: z.coerce
      .number()
      .int("City id must be an integer")
      .positive("City id must be positive"),
  }),
});

module.exports = {
  placeIdParamSchema,
  getPlacesQuerySchema,
  createPlaceSchema,
  updatePlaceSchema,
};