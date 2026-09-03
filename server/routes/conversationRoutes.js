const express = require("express");

const verifyJWT =
    require("../middleware/authMiddleware");

const {
    getUserConversations,
    getConversation,
    deleteConversation,
} = require("../controllers/conversationController");


const router = express.Router();


// Get all conversations of logged-in user
router.get(
    "/",
    verifyJWT,
    getUserConversations
);


// Get one conversation
router.get(
    "/:conversationId",
    verifyJWT,
    getConversation
);


// Delete one conversation
router.delete(
    "/:conversationId",
    verifyJWT,
    deleteConversation
);


module.exports = router;