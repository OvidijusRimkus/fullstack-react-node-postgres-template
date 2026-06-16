const { z } = require("zod");

/*
  City validacijos.

  Cities CRUD:
  GET    /api/cities
  GET    /api/cities/:id
  POST   /api/cities
  PATCH  /api/cities/:id
  DELETE /api/cities/:id
*/

/*
  Parametrų validacija route'ams su :id.

  Pvz:
  /api/cities/1

  req.params.id iš Express visada ateina kaip string.
  z.coerce.number() paverčia į number.
*/
const cityIdParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("City id must be an integer")
      .positive("City id must be positive"),
  }),
});

/*
  Miesto sukūrimas.

  Tikimės body:
  {
    "name": "Vilnius"
  }
*/
const createCitySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "City name must be at least 2 characters long")
      .max(100, "City name must be less than 100 characters"),
  }),
});

/*
  Miesto redagavimas.

  PATCH /api/cities/:id

  Tikimės:
  params.id
  body.name
*/
const updateCitySchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("City id must be an integer")
      .positive("City id must be positive"),
  }),

  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "City name must be at least 2 characters long")
      .max(100, "City name must be less than 100 characters"),
  }),
});

module.exports = {
  cityIdParamSchema,
  createCitySchema,
  updateCitySchema,
};