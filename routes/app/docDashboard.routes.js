const {
  getAllBookings,
  getSingleBooking,
  cancelSingleBooking,
} = require("../../controllers/app/docDashboard.controller");
const { verifyJwt } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.use(verifyJwt);

router.route("/").get(getAllBookings);

router.route("/:bookingId").get(getSingleBooking).patch(cancelSingleBooking);

module.exports = { router };
