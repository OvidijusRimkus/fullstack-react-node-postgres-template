const express = require("express");

const validate = require("../middlewares/validate");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

const {
  getPlaces,
  getPlace,
  addPlace,
  editPlace,
  removePlace,
} = require("../controllers/placeController");

const {
  placeIdParamSchema,
  getPlacesQuerySchema,
  createPlaceSchema,
  updatePlaceSchema,
} = require("../validations/placeValidation");

/*
  Place routes.

  Vieši routes:
  GET /api/places
  GET /api/places/:id

  Tik adminui:
  POST /api/places
  PATCH /api/places/:id
  DELETE /api/places/:id
*/

const router = express.Router();

/*
  GET /api/places

  Grąžina visas lankytinas vietas.

  Galimi filtrai:
  /api/places?city_id=1
  /api/places?type=Parkas
  /api/places?is_free=true
  /api/places?rating_min=4&rating_max=5
  /api/places?search=pilis
*/
router.get("/", validate(getPlacesQuerySchema), getPlaces);

/*
  GET /api/places/:id

  Grąžina vieną lankytiną vietą pagal id.
  Šitą vėliau naudosim "Skaityti daugiau" funkcijai.
*/
router.get("/:id", validate(placeIdParamSchema), getPlace);

/*
  Visi žemiau esantys routes reikalauja login.
*/
router.use(protect);

/*
  Visi žemiau esantys routes reikalauja admin rolės.
*/
router.use(restrictTo("admin"));

/*
  POST /api/places

  Body:
  {
    "name": "Trakų pilis",
    "type": "Pilis",
    "description": "Istorinė pilis Galvės ežero saloje.",
    "image_url": "https://example.com/image.jpg",
    "address": "Karaimų g. 43C, Trakai",
    "rating": 4.8,
    "is_free": false,
    "city_id": 3
  }
*/
router.post("/", validate(createPlaceSchema), addPlace);

/*
  PATCH /api/places/:id

  Kad būtų paprasčiau frontend formai,
  update kol kas reikalauja visų laukų kaip create.
*/
router.patch("/:id", validate(updatePlaceSchema), editPlace);

/*
  DELETE /api/places/:id
*/
router.delete("/:id", validate(placeIdParamSchema), removePlace);

module.exports = router;