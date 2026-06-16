const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const {
  getAllUsers,
  findUserById,
  updateUserRole,
  deleteUser,
} = require("../models/userModel");

/*
  User controlleris.

  Šitie endpointai bus admin dashboardui.

  Paprastas user neturėtų galėti:
  - matyti visų users;
  - keisti rolių;
  - trinti users.

  Todėl userRoutes.js faile visur naudosim:
  protect,
  restrictTo("admin")
*/

/*
  GET /api/users

  Admin gauna visų vartotojų sąrašą.
*/
const getUsers = catchAsync(async (req, res, next) => {
  const users = await getAllUsers();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

/*
  GET /api/users/:id

  Admin gauna vieną vartotoją pagal id.
*/
const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await findUserById(id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/*
  PATCH /api/users/:id/role

  Admin pakeičia vartotojo rolę.

  Body:
  {
    "role": "admin"
  }

  arba:
  {
    "role": "user"
  }

  Čia darom paprastą rankinę validaciją.
  Vėliau galima išsikelti į userValidation.js, bet kontroliniam ir taip aišku.
*/
const changeUserRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return next(new AppError("Role is required", 400));
  }

  if (!["user", "admin"].includes(role)) {
    return next(new AppError("Role must be either user or admin", 400));
  }

  const existingUser = await findUserById(id);

  if (!existingUser) {
    return next(new AppError("User not found", 404));
  }

  const updatedUser = await updateUserRole(id, role);

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

/*
  DELETE /api/users/:id

  Admin ištrina vartotoją.

  Papildoma apsauga:
  neleidžiam adminui ištrinti savęs.
*/
const removeUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (Number(id) === Number(req.user.id)) {
    return next(new AppError("You cannot delete your own account", 400));
  }

  const deletedUser = await deleteUser(id);

  if (!deletedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
    data: {
      user: deletedUser,
    },
  });
});

module.exports = {
  getUsers,
  getUser,
  changeUserRole,
  removeUser,
};