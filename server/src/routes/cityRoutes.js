const express = require("express");

const validate = require("../middlewares/validate");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

const {
  getCities,
  getCity,
  addCity,
  editCity,
  removeCity,
} = require("../controllers/cityController");

const {
  cityIdParamSchema,
  createCitySchema,
  updateCitySchema,
} = require("../validations/cityValidation");

/*
  City routes.

  Vieši:
  GET /api/cities
  GET /api/cities/:id

  Tik adminui:
  POST /api/cities
  PATCH /api/cities/:id
  DELETE /api/cities/:id
*/

const router = express.Router();

/*
  GET /api/cities

  Visi gali matyti miestų sąrašą.
*/
router.get("/", getCities);

/*
  GET /api/cities/:id

  Visi gali matyti vieną miestą.
*/
router.get("/:id", validate(cityIdParamSchema), getCity);

/*
  Visi žemiau esantys routes reikalauja login.
*/
router.use(protect);

/*
  Visi žemiau esantys routes reikalauja admin rolės.
*/
router.use(restrictTo("admin"));

/*
  POST /api/cities

  Body:
  {
    "name": "Palanga"
  }
*/
router.post("/", validate(createCitySchema), addCity);

/*
  PATCH /api/cities/:id

  Body:
  {
    "name": "Vilnius"
  }
*/
router.patch("/:id", validate(updateCitySchema), editCity);

/*
  DELETE /api/cities/:id

  Ištrina miestą ir visas jo lankytinas vietas.
*/
router.delete("/:id", validate(cityIdParamSchema), removeCity);

module.exports = router;