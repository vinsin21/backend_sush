const {
  insertDocDetails,
  updateDocDetails,
  getCurrDocDetails,
} = require("../../controllers/app/docDetails.controller");
const { auth } = require("../../middlewares/auth.middleware");
const { upload } = require("../../middlewares/multer.middleware");

const router = require("express").Router();

router.use(auth);

router
  .route("/")
  .post(upload.array("professionalCertificates", 6), insertDocDetails)
  .get(getCurrDocDetails)
  .patch(upload.array("professionalCertificates", 6), updateDocDetails);

module.exports = { router };
