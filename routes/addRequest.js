const express = require("express");
const { verifyUser } = require("../middlewares");
const wrapAsync = require("../utils/wrapAsync");
const { sendRequest, userAllRequests } = require("../controllers/addRequest");
const router = express.Router();


router.get("/",verifyUser, wrapAsync(userAllRequests));
router.post("/:id",verifyUser, wrapAsync(sendRequest));


module.exports = router;