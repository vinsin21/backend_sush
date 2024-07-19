// admin user routes

const {
  doctorRegister,
  disableDocter,
  verifyDocAccount,
} = require("../../controllers/admin/admin.controller");
const { auth } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.use(auth);

router.route("/doc/sign-up").post(doctorRegister);
router.route("/doc/verify-account").post(verifyDocAccount);

router.route("/doc/:userId").patch(disableDocter);

module.exports = { router };
