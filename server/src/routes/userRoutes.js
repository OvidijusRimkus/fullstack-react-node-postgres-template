const express = require("express");

const validate = require("../middlewares/validate");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

const {
  getUsers,
  getUser,
  changeUserRole,
  removeUser,
} = require("../controllers/userController");

const {
  userIdParamSchema,
  updateUserRoleSchema,
} = require("../validations/userValidation");

/*
  User routes.

  Visi šitie routes skirti admin dashboardui.

  protect:
  - patikrina ar vartotojas prisijungęs.

  restrictTo("admin"):
  - patikrina ar vartotojo role yra admin.
*/

const router = express.Router();

/*
  Visi žemiau esantys routes reikalauja login.
*/
router.use(protect);

/*
  Visi žemiau esantys routes reikalauja admin rolės.
*/
router.use(restrictTo("admin"));

/*
  GET /api/users

  Admin gauna visus vartotojus.
*/
router.get("/", getUsers);

/*
  PATCH /api/users/:id/role

  Svarbu:
  šitas route turi būti prieš "/:id",
  nes kitaip Express gali ":id" pagauti kaip "1" ar kitą reikšmę ne taip, kaip tikimės.
*/
router.patch("/:id/role", validate(updateUserRoleSchema), changeUserRole);

/*
  GET /api/users/:id

  Admin gauna vieną vartotoją.
*/
router.get("/:id", validate(userIdParamSchema), getUser);

/*
  DELETE /api/users/:id

  Admin ištrina vartotoją.
*/
router.delete("/:id", validate(userIdParamSchema), removeUser);

module.exports = router;