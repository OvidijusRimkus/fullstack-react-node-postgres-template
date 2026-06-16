const AppError = require("../utils/AppError");

/*
  restrictTo middleware.

  Naudosim po protect.

  Pvz:

  router.post(
    "/",
    protect,
    restrictTo("admin"),
    createCity
  );

  Reiškia:
  - pirma protect patikrina ar vartotojas prisijungęs;
  - tada restrictTo patikrina ar vartotojo role yra "admin";
  - jeigu ne admin, grąžinam 403 klaidą.
*/

const restrictTo = (...roles) => {
  return (req, res, next) => {
    /*
      Jeigu dėl kažkokios priežasties req.user nėra,
      reiškia route nebuvo apsaugotas su protect.
    */
    if (!req.user) {
      return next(new AppError("User is not authenticated.", 401));
    }

    /*
      roles yra masyvas.

      Pvz:
      restrictTo("admin")

      roles bus:
      ["admin"]

      Jeigu vėliau norėtume leisti kelias roles:
      restrictTo("admin", "manager")
    */
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }

    next();
  };
};

module.exports = restrictTo;