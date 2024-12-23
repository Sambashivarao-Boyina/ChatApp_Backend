const express = require("express")
const { verifyUser } = require("../middlewares")
const wrapAsync = require("../utils/wrapAsync")
const { getAllUsers, getUserById, getAllFriends, getMyDetails, updateUserAbout } = require("../controllers/user")
const { route } = require("./addRequest")
const router = express.Router()

router.get("/", verifyUser, wrapAsync(getAllUsers))
router.get("/details",verifyUser, wrapAsync(getMyDetails))
router.get("/friends",verifyUser, wrapAsync(getAllFriends))
router.get("/:id", verifyUser,wrapAsync(getUserById))
router.patch("/about",verifyUser, wrapAsync(updateUserAbout))


module.exports = router