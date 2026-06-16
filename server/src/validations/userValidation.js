const { z } = require("zod");

/*
  User validacijos.

  Naudosim admin dashboardui:
  GET /api/users/:id
  PATCH /api/users/:id/role
  DELETE /api/users/:id
*/

/*
  User id validacija.

  Express req.params.id visada ateina kaip string,
  todėl naudojam z.coerce.number().
*/
const userIdParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("User id must be an integer")
      .positive("User id must be positive"),
  }),
});

/*
  Role keitimo validacija.

  Body:
  {
    "role": "admin"
  }

  arba:
  {
    "role": "user"
  }
*/
const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("User id must be an integer")
      .positive("User id must be positive"),
  }),

  body: z.object({
    role: z.enum(["user", "admin"], {
      message: "Role must be either user or admin",
    }),
  }),
});

module.exports = {
  userIdParamSchema,
  updateUserRoleSchema,
};