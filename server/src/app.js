const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { testConnection } = require("./db");

/*
  Šitų failų dar neturim, bet tuoj susikursim.
  Kol kas importai gali būti, svarbu kad failai egzistuotų.

  Jeigu dar nesukūrei failų, terminale gali padaryti:

  touch src/routes/authRoutes.js
  touch src/routes/userRoutes.js
  touch src/routes/cityRoutes.js
  touch src/routes/placeRoutes.js
  touch src/middlewares/globalErrorHandler.js
  touch src/utils/AppError.js
*/
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cityRoutes = require("./routes/cityRoutes");
const placeRoutes = require("./routes/placeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

// Sukuriam Express aplikaciją
const app = express();

/*
  Helmet prideda bazinius saugumo headerius.
  Pvz. apsaugo nuo kai kurių dažnų web saugumo problemų.
*/
app.use(helmet());

/*
  Morgan rodo requestus terminale.
  Pvz. GET /api/health 200
  Development metu labai patogu matyti, kokie requestai ateina.
*/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/*
  CORS nustatymai.

  origin - leidžiam requestus tik iš frontend adreso.
  credentials: true - būtina, jeigu naudojam cookies.
  Be šito naršyklė neleis normaliai siųsti/priimti JWT cookie.
*/
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/*
  Leidžia Express skaityti JSON body.

  Pvz. kai frontend siunčia:
  {
    "email": "test@test.com",
    "password": "123456"
  }

  Tada controller'yje galėsim naudoti req.body.
*/
app.use(express.json());

/*
  Leidžia skaityti cookies iš requesto.

  Pvz. JWT tokeną iš:
  req.cookies.jwt
*/
app.use(cookieParser());

/*
  Health endpointas.

  Patikrins:
  ar backend gyvas;
  ar DB pasiekiama.
*/
app.get("/api/health", async (req, res, next) => {
  try {
    const dbTime = await testConnection();

    res.status(200).json({
      status: "success",
      message: "Server is running",
      database: "connected",
      dbTime,
    });
  } catch (error) {
    next(error);
  }
});

/*
  Pagrindiniai API routes.

  Auth:
  /api/auth/register
  /api/auth/login
  /api/auth/logout
  /api/auth/me

  Users:
  /api/users

  Cities:
  /api/cities

  Places:
  /api/places
*/
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/admin", adminRoutes);

/*
  Jeigu requestas nepataiko į jokį route,
  išmetam 404 klaidą.
*/
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

/*
  Globalus klaidų handleris.

  Visos klaidos, kurios nueina per next(error),
  galiausiai patenka čia.
*/
app.use(globalErrorHandler);

module.exports = app;