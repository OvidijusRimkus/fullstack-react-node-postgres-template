const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} = require("../models/cityModel");

/*
  City controlleris.

  Controllerio darbas:
  - pasiimti duomenis iš req;
  - iškviesti modelį;
  - grąžinti response;
  - jeigu kažkas blogai, perduoti klaidą į next().
*/

/*
  GET /api/cities

  Grąžina visų miestų sąrašą.
  Šitas route bus viešas, todėl galės matyti ir neprisijungę vartotojai.
*/
const getCities = catchAsync(async (req, res, next) => {
  const cities = await getAllCities();

  res.status(200).json({
    status: "success",
    results: cities.length,
    data: {
      cities,
    },
  });
});

/*
  GET /api/cities/:id

  Grąžina vieną miestą pagal id.
*/
const getCity = catchAsync(async (req, res, next) => {
  /*
    Jeigu route naudoja validate(cityIdParamSchema),
    tada id galim imti iš req.validated.params.
    Ten jis jau bus paverstas į number.
  */
  const { id } = req.validated.params;

  const city = await getCityById(id);

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      city,
    },
  });
});

/*
  POST /api/cities

  Sukuria naują miestą.
  Šitas route bus tik adminui.
*/
const addCity = catchAsync(async (req, res, next) => {
  const { name } = req.validated.body;

  const city = await createCity({ name });

  res.status(201).json({
    status: "success",
    data: {
      city,
    },
  });
});

/*
  PATCH /api/cities/:id

  Atnaujina miesto pavadinimą.
  Šitas route bus tik adminui.
*/
const editCity = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;
  const { name } = req.validated.body;

  const city = await updateCity(id, { name });

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      city,
    },
  });
});

/*
  DELETE /api/cities/:id

  Ištrina miestą.

  Kadangi DB places.city_id turi ON DELETE CASCADE,
  ištrynus miestą automatiškai išsitrins ir visos to miesto vietos.
*/
const removeCity = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const city = await deleteCity(id);

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "City and related places deleted successfully",
    data: {
      city,
    },
  });
});

module.exports = {
  getCities,
  getCity,
  addCity,
  editCity,
  removeCity,
};