const {
  getAllActiveDoctors,
} = require("../../controllers/app/publicApis.controller");

const router = require("express").Router();

router.route("/all").get(getAllActiveDoctors);

module.exports = { router };
