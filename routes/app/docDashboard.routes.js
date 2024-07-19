const {
  getAllBookings,
  getSingleBooking,
  cancelSingleBooking,
} = require("../../controllers/app/docDashboard.controller");
const { auth } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.use(auth);

router.route("/").get(getAllBookings);

router.route("/:bookingId").get(getSingleBooking).patch(cancelSingleBooking);

module.exports = { router };
