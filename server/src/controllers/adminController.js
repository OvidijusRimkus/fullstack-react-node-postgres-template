const catchAsync = require("../utils/catchAsync");

const {
  getDashboardStats,
  getPlacesCountByCity,
  getPlacesCountByType,
  getLatestPlaces,
} = require("../models/adminModel");

/*
  Admin controlleris.

  Čia bus endpointai admin dashboardui.
  Visi admin routes bus apsaugoti su:
  protect + restrictTo("admin")
*/

/*
  GET /api/admin/dashboard

  Grąžina visą dashboard informaciją vienu requestu.
  Frontendui bus patogu:
  vienas API call -> visi admin skaičiai.
*/
const getAdminDashboard = catchAsync(async (req, res, next) => {
  const stats = await getDashboardStats();
  const placesByCity = await getPlacesCountByCity();
  const placesByType = await getPlacesCountByType();
  const latestPlaces = await getLatestPlaces();

  res.status(200).json({
    status: "success",
    data: {
      stats,
      placesByCity,
      placesByType,
      latestPlaces,
    },
  });
});

module.exports = {
  getAdminDashboard,
};