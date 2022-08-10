// const express = require("express");
// const router = express.Router();
// const signUp = require("../controller/authentication.controller");

// router.route("/signup").post(signUp);

// module.exports = router;

const express = require("express");
const controller = require("../controller/authentication.controller");

const authRouter = express.Router();

authRouter.route("/signup").post(controller.signUp);
authRouter.route("/signin").post(controller.signIn);
authRouter.route("/forget_password").post(controller.forgetPassword);
authRouter.route("/reset_password").post(controller.resetPassword);

module.exports = authRouter;
