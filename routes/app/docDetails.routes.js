const {
  insertDocDetails,
  updateDocDetails,
} = require("../../controllers/app/doc.controller");
const { upload } = require("../../middlewares/multer.middleware");

const router = require("express").Router();

router
  .route("/doctor")
  .post(upload.array("professionalCertificates", 6), insertDocDetails)
  .get(getCurrDocDetails)
  .patch(upload.array("professionalCertificates", 6), updateDocDetails);

module.exports = { router };
