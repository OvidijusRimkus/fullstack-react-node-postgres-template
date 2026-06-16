const { z } = require("zod");

/*
  Auth validacijos.

  Čia tikrinam duomenis, kurie ateina į:
  POST /api/auth/register
  POST /api/auth/login

  Validacija daroma prieš controllerį.
  Jeigu duomenys blogi, vartotojas gaus 400 klaidą.
*/

/*
  Register schema.

  Tikimės body:
  {
    "name": "Ovidijus",
    "email": "test@test.com",
    "password": "123456"
  }
*/
const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name must be less than 100 characters"),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(150, "Email must be less than 150 characters")
      .toLowerCase(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be less than 100 characters"),
  }),
});

/*
  Login schema.

  Tikimės body:
  {
    "email": "test@test.com",
    "password": "123456"
  }
*/
const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};