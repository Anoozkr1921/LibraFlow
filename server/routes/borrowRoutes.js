const express = require("express");

const router = express.Router();

const verifyJWT = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
    borrowBookValidator,
} = require("../validators/borrowValidator");

const {
    borrowBook,
    returnBook,
} = require("../controllers/borrowController");

router.post(
    "/",
    verifyJWT,
    borrowBookValidator,
    validate,
    borrowBook
);

router.post(
    "/return/:borrowId",
    verifyJWT,
    returnBook
);

module.exports = router;