const {
  makePrescription,
  getAllPrescriptions,
  getSinglePrescription,
  updateSinglePrescription,
  getCustomerPrescriptions,
} = require("../../controllers/app/prescription.controller");
const { auth } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.use(auth);

router.route("/").post(makePrescription).get(getAllPrescriptions);

router.route("/:custId").get(getCustomerPrescriptions);

router
  .route("/:prescriptionId")
  .get(getSinglePrescription)
  .patch(updateSinglePrescription);

module.exports = { router };
