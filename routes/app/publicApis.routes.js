const {
  getAllActiveDoctors,
  getSingleDoctor,
} = require("../../controllers/app/publicApis.controller");

const router = require("express").Router();

router.route("/all").get(getAllActiveDoctors);

router.route("/:userId").get(getSingleDoctor);


module.exports = { router };
