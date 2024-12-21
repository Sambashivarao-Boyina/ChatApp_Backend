const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { userSignUp, userSignIn } = require("../controllers/auth");
const router = express.Router();

router.post("/signup",wrapAsync(userSignUp))
router.post("/login",wrapAsync(userSignIn))

module.exports = router