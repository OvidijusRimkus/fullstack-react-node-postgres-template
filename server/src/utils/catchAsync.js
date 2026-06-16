/*
  catchAsync yra helperis async controller funkcijoms.

  Problema:
  Express pats automatiškai nepagauna async klaidų visose situacijose.

  Pvz. jeigu controller'yje darom:
  const user = await getUserById(id);

  Ir ten įvyksta klaida, mums reikėtų visur rašyti try/catch.

  Su catchAsync galėsim rašyti švariau:

  const getUsers = catchAsync(async (req, res, next) => {
    const users = await getAllUsers();

    res.status(200).json({
      status: "success",
      data: { users },
    });
  });

  Jeigu įvyks klaida, catchAsync automatiškai perduos ją į:
  next(error)

  Tada klaidą pagaus globalErrorHandler.js.
*/

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;