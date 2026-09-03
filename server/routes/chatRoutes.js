const express = require("express");

const {
    chatController,
} = require("../controllers/chatController");
const verifyJWT = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/" , verifyJWT, chatController );

module.exports = router;