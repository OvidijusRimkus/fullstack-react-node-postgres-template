const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const { findUserById } = require("../models/userModel");

/*
  protect middleware.

  Jo tikslas:
  - patikrinti, ar vartotojas prisijungęs;
  - ištraukti JWT tokeną;
  - patikrinti tokeną;
  - pagal tokeno id rasti vartotoją DB;
  - įdėti vartotoją į req.user.

  Tada kiti middleware/controlleriai galės naudoti:
  req.user
*/
const protect = catchAsync(async (req, res, next) => {
  let token;

  /*
    Pagrindinis variantas mūsų projekte:
    tokenas ateina iš cookie.

    Cookie pavadinimas:
    jwt
  */
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  /*
    Papildomas variantas testavimui per Postman:
    Authorization: Bearer TOKEN

    Tai nėra būtina frontendui, bet labai patogu testuojant.
  */
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in first.", 401)
    );
  }

  /*
    Patikrinam tokeną.

    Jeigu tokenas blogas arba pasibaigęs,
    klaidą pagaus globalErrorHandler.js.
  */
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  /*
    decoded atrodo maždaug taip:
    {
      id: 1,
      iat: 1710000000,
      exp: 1710600000
    }
  */

  const currentUser = await findUserById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  /*
    Įdedam vartotoją į requestą.

    Pvz. restrictTo middleware galės tikrinti:
    req.user.role
  */
  req.user = currentUser;

  next();
});

module.exports = protect;