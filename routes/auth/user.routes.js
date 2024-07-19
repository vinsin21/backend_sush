const {
  userRegister,
  verifyAccount,
  userLogin,
  getCurrentUser,
  logoutUser,
} = require("../../controllers/auth/user.controller");
const { auth } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/sign-up").post(userRegister);
router.route("/verify-account").post(verifyAccount);
router.route("/sign-in").post(userLogin);
router.route("/crnt-usr").get(auth, getCurrentUser);
router.route("/logout").get(auth, logoutUser);

module.exports = { router };
