const express = require("express");
const router = express.Router();

const {
    register,
    verifyEmail,
    login,
    getCurrentUser,
    logout,
} = require("../controllers/authController");

const validate = require("../middleware/validate");
const verifyJWT = require("../middleware/authMiddleware");

const {
    registerValidator,
    loginValidator,
} = require("../validators/authValidator");

// Public Routes
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.get(
    "/verify-email/:token",
    verifyEmail
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

// Protected Routes
router.get(
    "/me",
    verifyJWT,
    getCurrentUser
);

router.post(
    "/logout",
    verifyJWT,
    logout
);

module.exports = router;