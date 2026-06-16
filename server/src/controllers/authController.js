const bcrypt = require("bcryptjs");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const signToken = require("../utils/signToken");

const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../models/userModel");

/*
  Funkcija, kuri sukuria JWT tokeną ir įdeda jį į httpOnly cookie.

  httpOnly reiškia:
  - JavaScript frontend'e negali tiesiogiai perskaityti cookie;
  - taip saugiau nuo XSS atakų.

  Frontend vis tiek galės siųsti requestus su cookie,
  jeigu axios naudos:
  withCredentials: true
*/
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieExpiresInDays = Number(process.env.COOKIE_EXPIRES_IN_DAYS) || 7;

  const cookieOptions = {
    expires: new Date(
      Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,

    /*
      sameSite: "lax" dažniausiai tinka local developmentui,
      kai frontend ir backend yra ant localhost,
      bet skirtingų portų.
    */
    sameSite: "lax",

    /*
      secure turi būti true production režime,
      kai naudojamas HTTPS.

      Development metu paliekam false,
      nes localhost dažniausiai eina per HTTP.
    */
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  /*
    Į response slaptažodžio niekada nesiunčiam.
    Modelis createUser ir findUserById jau dažniausiai grąžina be password,
    bet čia dar papildoma apsauga.
  */
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };

  res.status(statusCode).json({
  status: "success",
  data: {
    user: safeUser,
  },
});
};

/*
  POST /api/auth/register

  Sukuria naują vartotoją.
  Pagal nutylėjimą DB role bus "user".
*/
const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.validated.body;

  /*
    Prieš saugant slaptažodį DB, jį užhashinam su bcrypt.

    12 - salt rounds.
    Kuo didesnis skaičius, tuo saugiau, bet lėčiau.
    Mokymuisi 12 yra normalus pasirinkimas.
  */
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  createSendToken(user, 201, res);
});

/*
  POST /api/auth/login

  Patikrina email ir slaptažodį.
  Jeigu viskas gerai, išduoda JWT cookie.
*/
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.validated.body;

  const user = await findUserByEmail(email);

  /*
    Saugumo sumetimais nerašom:
    "email not found" arba "wrong password".

    Geriau bendra žinutė:
    "Incorrect email or password".
  */
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

/*
  POST /api/auth/logout

  Išvalom JWT cookie.

  Techniskai JWT tokenas pats lieka galiojantis iki expiration,
  bet naršyklė jo nebesiųs, nes cookie bus pakeistas į tuščią.
*/
const logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

/*
  GET /api/auth/me

  Grąžina dabartinį prisijungusį vartotoją.

  Šitas route turės būti apsaugotas su protect middleware.
  protect middleware įdės vartotoją į req.user.
*/
const getMe = catchAsync(async (req, res, next) => {
  const user = await findUserById(req.user.id);

  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};