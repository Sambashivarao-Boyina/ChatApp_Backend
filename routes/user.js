const express = require("express")
const { verifyUser } = require("../middlewares")
const wrapAsync = require("../utils/wrapAsync")
const { getAllUsers, getUserById } = require("../controllers/user")
const router = express.Router()

router.get("/", verifyUser, wrapAsync(getAllUsers))

router.get("/:id", verifyUser,wrapAsync(getUserById))

module.exports = router