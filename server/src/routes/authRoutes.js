const express = require("express");

const validate = require("../middlewares/validate");
const protect = require("../middlewares/protect");

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");

/*
  Auth routes.

  Čia valdome:
  - registraciją;
  - prisijungimą;
  - atsijungimą;
  - dabartinio vartotojo patikrinimą.
*/

const router = express.Router();

/*
  POST /api/auth/register

  Body:
  {
    "name": "Ovidijus",
    "email": "test@test.com",
    "password": "123456"
  }

  validate(registerSchema) patikrina body.
  register controlleris:
  - užhashina password su bcrypt;
  - sukuria user DB;
  - sukuria JWT;
  - įdeda JWT į httpOnly cookie.
*/
router.post("/register", validate(registerSchema), register);

/*
  POST /api/auth/login

  Body:
  {
    "email": "test@test.com",
    "password": "123456"
  }

  login controlleris:
  - randa user pagal email;
  - bcrypt.compare patikrina password;
  - sukuria JWT cookie.
*/
router.post("/login", validate(loginSchema), login);

/*
  POST /api/auth/logout

  Išvalo JWT cookie.
*/
router.post("/logout", logout);

/*
  GET /api/auth/me

  Apsaugotas route.
  Pirma protect patikrina JWT cookie.
  Jeigu viskas gerai, req.user bus dabartinis user.
*/
router.get("/me", protect, getMe);

/*
  Test route gali palikti arba ištrinti.
  Paliekam, nes patogu greitai tikrinti ar failas prijungtas.
*/
router.get("/test", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Auth routes are working",
  });
});

module.exports = router;