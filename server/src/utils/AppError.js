/*
  AppError yra mūsų custom klaidos klasė.

  Kam ji reikalinga?

  Vietoj to, kad visur rašytume:
  res.status(404).json(...)

  Galėsim rašyti:
  throw new AppError("City not found", 404);

  Tada klaida keliaus į globalErrorHandler.js,
  kuris vienodai sutvarkys visų klaidų atsakymus.
*/

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    /*
      Jeigu statusCode prasideda iš 4, tai client klaida:
      400, 401, 403, 404.

      Jeigu ne, tada server klaida:
      500 ir panašiai.
    */
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    /*
      isOperational reiškia, kad tai mūsų kontroliuojama klaida.
      Pvz. blogas slaptažodis, nerastas miestas, validacijos klaida.

      Ne operational klaidos būtų programavimo klaidos:
      undefined.map(...)
      blogas importas
      sintaksės klaida
    */
    this.isOperational = true;

    /*
      Pašalinam constructor dalį iš stack trace,
      kad klaidos būtų švaresnės.
    */
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;