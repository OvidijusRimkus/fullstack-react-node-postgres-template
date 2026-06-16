/*
  Globalus klaidų handleris.

  Express klaidų middleware visada turi 4 parametrus:
  err, req, res, next

  Net jeigu next nenaudojam, jis turi būti.
*/

const handlePostgresError = (err) => {
  /*
    PostgreSQL klaidos turi code lauką.

    Dažniausiai naudingi kodai:
    23505 - duplicate key, pvz. email arba miesto name jau egzistuoja
    23503 - foreign key violation, pvz. city_id neegzistuoja
    23502 - not null violation, pvz. trūksta privalomo lauko
    22P02 - invalid input syntax, pvz. blogas UUID arba blogas number formatas
  */

  if (err.code === "23505") {
    return {
      statusCode: 400,
      status: "fail",
      message: "Duplicate value. This record already exists.",
    };
  }

  if (err.code === "23503") {
    return {
      statusCode: 400,
      status: "fail",
      message: "Related record does not exist.",
    };
  }

  if (err.code === "23502") {
    return {
      statusCode: 400,
      status: "fail",
      message: "Required field is missing.",
    };
  }

  if (err.code === "22P02") {
    return {
      statusCode: 400,
      status: "fail",
      message: "Invalid input value.",
    };
  }

  return null;
};

const sendErrorDev = (err, res) => {
  /*
    Development režime rodome daugiau informacijos.
    Tai patogu mokantis ir taisant klaidas.
  */

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  /*
    Production režime nerodom stack trace.
    Vartotojas neturi matyti vidinių serverio klaidų.
  */

  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong.",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  /*
    Padarom kopiją, kad galėtume saugiai keisti klaidos laukus.
  */

  let error = {
    ...err,
    message: err.message,
    statusCode: err.statusCode || 500,
    status: err.status || "error",
  };

  /*
    Patikrinam ar tai PostgreSQL klaida.
  */
  const postgresError = handlePostgresError(err);

  if (postgresError) {
    error = {
      ...error,
      ...postgresError,
      isOperational: true,
    };
  }

  /*
    Jeigu JWT tokenas blogas.
  */
  if (err.name === "JsonWebTokenError") {
    error = {
      ...error,
      statusCode: 401,
      status: "fail",
      message: "Invalid token. Please log in again.",
      isOperational: true,
    };
  }

  /*
    Jeigu JWT tokenas pasibaigęs.
  */
  if (err.name === "TokenExpiredError") {
    error = {
      ...error,
      statusCode: 401,
      status: "fail",
      message: "Your session has expired. Please log in again.",
      isOperational: true,
    };
  }

  /*
    Jeigu body JSON blogai parašytas.
    Pvz. Postman'e paliktas kablelis JSON gale.
  */
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    error = {
      ...error,
      statusCode: 400,
      status: "fail",
      message: "Invalid JSON body.",
      isOperational: true,
    };
  }

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(error, res);
  }

  return sendErrorProd(error, res);
};

module.exports = globalErrorHandler;