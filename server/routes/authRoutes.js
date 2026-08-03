const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");

const validate = require("../middleware/validate");

const { verifyEmail } = require("../controllers/authController");

router.get("/verify-email/:token", verifyEmail);

const { registerValidator } = require("../validators/authValidator");

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

module.exports = router;