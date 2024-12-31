const express = require("express")
const { verifyUser } = require("../middlewares")
const wrapAsync = require("../utils/wrapAsync")
const { getFriend, sendMessage, getAllFriends, getChat, blockUser, unblockUser } = require("../controllers/friend")
const router = express.Router()

router.get("/", verifyUser, wrapAsync(getAllFriends))
router.get("/chat/:id", verifyUser, wrapAsync(getChat))
router.get("/:id", verifyUser, wrapAsync(getFriend))
router.post("/:id/send", verifyUser, wrapAsync(sendMessage))
router.patch("/:id/block", verifyUser, wrapAsync(blockUser))
router.patch("/:id/unblock", verifyUser, wrapAsync(unblockUser))

module.exports = router