const express = require("express")
const { verifyUser } = require("../middlewares")
const wrapAsync = require("../utils/wrapAsync")
const { getAllUsers, getUserById, getMyDetails, updateUserAbout, searchUser, updateUserProfile, getActiveUsers, saveFcmToken, updateUsername, updatePassword, deleteFcmToken } = require("../controllers/user")
const router = express.Router()

const cloudinary =  require("cloudinary").v2
const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const User = require("../models/user")


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

router.get("/", verifyUser, wrapAsync(getAllUsers))
router.patch("/updateProfile",verifyUser,upload.single("file"),wrapAsync(updateUserProfile))
router.get("/search/:searchValue", verifyUser, wrapAsync(searchUser))
router.get("/details",verifyUser, wrapAsync(getMyDetails))
router.get("/activeUsers",verifyUser, wrapAsync(getActiveUsers))

router.get("/:id", verifyUser, wrapAsync(getUserById))
router.patch("/about", verifyUser, wrapAsync(updateUserAbout))
router.patch("/username",verifyUser, wrapAsync(updateUsername))
router.patch("/password", verifyUser, wrapAsync(updatePassword))
router.patch("/fcmToken", verifyUser, wrapAsync(saveFcmToken))
router.patch("/deleteFcmToken",verifyUser, wrapAsync(deleteFcmToken))



module.exports = router