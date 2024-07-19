const {
  createDocTimeSlots,
  getCurrentTimeSlots,
  updateCurrentTimeSlots,
} = require("../../controllers/app/docTimeSlots.controller");
const { auth } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.use(auth);

router
  .route("/")
  .post(createDocTimeSlots)
  .get(getCurrentTimeSlots)
  .patch(updateCurrentTimeSlots);

module.exports = { router };
