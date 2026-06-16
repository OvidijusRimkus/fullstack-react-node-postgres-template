const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../models/placeModel");

/*
  Place controlleris.

  Čia valdysim lankytinų vietų CRUD ir filtravimą.
*/

/*
  GET /api/places

  Grąžina visas lankytinas vietas.

  Galimi query filtrai:
  /api/places?city_id=1
  /api/places?type=Parkas
  /api/places?is_free=true
  /api/places?rating_min=4&rating_max=5
  /api/places?search=pilis

  Jeigu route naudoja validate(getPlacesQuerySchema),
  tada filtrai bus req.validated.query.
*/
const getPlaces = catchAsync(async (req, res, next) => {
  const filters = req.validated?.query || {};

  const places = await getAllPlaces(filters);

  res.status(200).json({
    status: "success",
    results: places.length,
    data: {
      places,
    },
  });
});

/*
  GET /api/places/:id

  Grąžina vieną lankytiną vietą pagal id.
  Šitą naudosim "Skaityti daugiau" funkcijai.
*/
const getPlace = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const place = await getPlaceById(id);

  if (!place) {
    return next(new AppError("Place not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      place,
    },
  });
});

/*
  POST /api/places

  Sukuria naują lankytiną vietą.
  Tik adminui.
*/
const addPlace = catchAsync(async (req, res, next) => {
  const placeData = req.validated.body;

  const place = await createPlace(placeData);

  res.status(201).json({
    status: "success",
    data: {
      place,
    },
  });
});

/*
  PATCH /api/places/:id

  Redaguoja lankytiną vietą.
  Tik adminui.
*/
const editPlace = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;
  const placeData = req.validated.body;

  const place = await updatePlace(id, placeData);

  if (!place) {
    return next(new AppError("Place not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      place,
    },
  });
});

/*
  DELETE /api/places/:id

  Ištrina lankytiną vietą.
  Tik adminui.
*/
const removePlace = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const place = await deletePlace(id);

  if (!place) {
    return next(new AppError("Place not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Place deleted successfully",
    data: {
      place,
    },
  });
});

module.exports = {
  getPlaces,
  getPlace,
  addPlace,
  editPlace,
  removePlace,
};