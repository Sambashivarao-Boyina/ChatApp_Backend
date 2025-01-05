const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { userSignUp, userSignIn, refreshToken, googleSignIn } = require("../controllers/auth");
const router = express.Router();

router.post("/signup",wrapAsync(userSignUp))
router.post("/login",wrapAsync(userSignIn))
router.get("/refreshToken", wrapAsync(refreshToken))
router.post("/google",wrapAsync(googleSignIn))

module.exports = router