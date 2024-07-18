const {
  userRegister,
  verifyAccount,
  userLogin,
  getCurrentUser,
} = require("../../controllers/auth/user.controller");
const { verifyJwt } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/sign-up").post(userRegister);
router.route("/verify-account").post(verifyAccount);
router.route("/sign-in").post(userLogin);
router.route("/crnt-usr").get(verifyJwt, getCurrentUser);

module.exports = { router };
