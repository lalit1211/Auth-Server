const express = require("express");
const router = express.Router();
const autheRouter = require("./authentication.routes");

router.use("/auth", autheRouter);

module.exports = router;
