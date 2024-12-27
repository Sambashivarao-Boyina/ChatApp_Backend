const express = require("express")
const { verifyUser } = require("../middlewares")
const wrapAsync = require("../utils/wrapAsync")
const { getFriend, sendMessage, getAllFriends, getChat } = require("../controllers/friend")
const router = express.Router()

router.get("/",verifyUser, wrapAsync(getAllFriends))
router.get("/chat/:id", verifyUser, wrapAsync(getChat))
router.get("/:id", verifyUser, wrapAsync(getFriend))
router.post("/:id/send",verifyUser, wrapAsync(sendMessage))

module.exports = router