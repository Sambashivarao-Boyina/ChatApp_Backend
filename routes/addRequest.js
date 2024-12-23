const express = require("express");
const { verifyUser } = require("../middlewares");
const wrapAsync = require("../utils/wrapAsync");
const { sendRequest, userAllRequests, rejectRequest, acceptRequest } = require("../controllers/addRequest");
const router = express.Router();


router.get("/", verifyUser, wrapAsync(userAllRequests));
router.post("/:id", verifyUser, wrapAsync(sendRequest));
router.patch("/reject/:id", verifyUser, wrapAsync(rejectRequest));
router.patch("/accept/:id", verifyUser, wrapAsync(acceptRequest));  


module.exports = router;