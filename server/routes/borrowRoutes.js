const express = require("express");

const router = express.Router();

const verifyJWT = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
    borrowBookValidator,
} = require("../validators/borrowValidator");

const {
    borrowBook,
} = require("../controllers/borrowController");

router.post(
    "/",
    verifyJWT,
    borrowBookValidator,
    validate,
    borrowBook
);

module.exports = router;