const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const validate = require("../middleware/validate");

const {
    addBookValidator,
} = require("../validators/bookValidator");

const {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");

router.get(
    "/",
    getAllBooks
);

router.get(
    "/:id",
    getBookById
);

router.post(
    "/",
    verifyJWT,
    isAdmin,
    addBookValidator,
    validate,
    addBook
);

router.put(
    "/:id",
    verifyJWT,
    updateBook
);

router.delete(
    "/:id",
    verifyJWT,
    isAdmin,
    deleteBook
);

module.exports = router;