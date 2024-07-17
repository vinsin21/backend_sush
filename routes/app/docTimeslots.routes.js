const {
  createDocTimeSlots,
  getCurrentTimeSlots,
  updateCurrentTimeSlots,
} = require("../../controllers/app/docTimeSlots.controller");
const { verifyJwt } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.use(verifyJwt);

router
  .route("/")
  .post(createDocTimeSlots)
  .get(getCurrentTimeSlots)
  .patch(updateCurrentTimeSlots);

module.exports = { router };
