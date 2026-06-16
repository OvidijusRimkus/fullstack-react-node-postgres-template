/*
  Bendras validacijos middleware.

  Jį naudosim route failuose prieš controllerį.

  Pvz:

  router.post(
    "/",
    protect,
    restrictTo("admin"),
    validate(createCitySchema),
    createCity
  );

  Tada:
  1. ateina requestas;
  2. validate patikrina req.body, req.params arba req.query;
  3. jeigu duomenys blogi - grąžina 400 klaidą;
  4. jeigu geri - leidžia eiti į controllerį.
*/

const AppError = require("../utils/AppError");

const validate = (schema) => {
  return (req, res, next) => {
    /*
      Zod schema tikrins objektą, kuriame gali būti:
      body
      params
      query

      Tai patogu, nes skirtingiems route galėsim validuoti skirtingas dalis.
    */
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      /*
        Zod v4 klaidos dažniausiai yra result.error.issues.
        Kiekvieną klaidą paverčiam į aiškesnį tekstą.
      */
      const errors = result.error.issues.map((issue) => {
        return {
          path: issue.path.join("."),
          message: issue.message,
        };
      });

      return next(
        new AppError(
          `Validation failed: ${errors
            .map((error) => `${error.path} - ${error.message}`)
            .join("; ")}`,
          400
        )
      );
    }

    /*
      Čia labai patogu:
      po validacijos pakeičiam req.body, req.params, req.query į jau validuotus duomenis.

      Pvz. jeigu Zod paverčia rating iš string į number,
      controlleris jau gaus tvarkingą Number.
    */
    req.validated = result.data;

    next();
  };
};

module.exports = validate;