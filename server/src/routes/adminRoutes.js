const express = require("express");

const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

const {
  getAdminDashboard,
} = require("../controllers/adminController");

/*
  Admin routes.

  Visi šitie routes:
  - reikalauja prisijungimo;
  - reikalauja admin rolės.
*/

const router = express.Router();

/*
  Visi admin routes apsaugoti.
*/
router.use(protect);
router.use(restrictTo("admin"));

/*
  GET /api/admin/dashboard

  Grąžina dashboard statistiką.
*/
router.get("/dashboard", getAdminDashboard);

module.exports = router;