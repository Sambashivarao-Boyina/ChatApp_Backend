const express = require("express")
const { verifyUser } = require("../middlewares")
const wrapAsync = require("../utils/wrapAsync")
const { getFriend, sendMessage, getAllFriends, getChat, blockUser, unblockUser, sendImage } = require("../controllers/friend")
const router = express.Router()
const cloudinary =  require("cloudinary").v2
const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder:"chatter"
    }
})

const upload = multer({storage})


router.get("/", verifyUser, wrapAsync(getAllFriends))
router.get("/chat/:id", verifyUser, wrapAsync(getChat))
router.get("/:id", verifyUser, wrapAsync(getFriend))
router.post("/:id/send", verifyUser, wrapAsync(sendMessage))
router.post("/:id/sendImage", verifyUser, upload.single("file"), wrapAsync(sendImage))
router.patch("/:id/block", verifyUser, wrapAsync(blockUser))
router.patch("/:id/unblock", verifyUser, wrapAsync(unblockUser))

module.exports = router