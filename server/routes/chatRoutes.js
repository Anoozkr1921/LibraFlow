const express = require("express");

const {
    chatController,
} = require("../controllers/chatController");
const verifyJWT = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", chatController , verifyJWT);

module.exports = router;