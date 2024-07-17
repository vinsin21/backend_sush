const {
  insertDocDetails,
  updateDocDetails,
  getCurrDocDetails,
} = require("../../controllers/app/docDetails.controller");
const { verifyJwt } = require("../../middlewares/auth.middleware");
const { upload } = require("../../middlewares/multer.middleware");

const router = require("express").Router();

router.use(verifyJwt);

router
  .route("/")
  .post(upload.array("professionalCertificates", 6), insertDocDetails)
  .get(getCurrDocDetails)
  .patch(upload.array("professionalCertificates", 6), updateDocDetails);

module.exports = { router };
