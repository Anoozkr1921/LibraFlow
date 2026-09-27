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
    restoreBook,
} = require("../controllers/bookController");

const upload = require("../middleware/uploadMiddleware");

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
    upload.withErrors,
    addBookValidator,
    validate,
    addBook
);

router.put(
    "/:id",
    verifyJWT,
    isAdmin,
    upload.withErrors,
    updateBook
);

router.delete(
    "/:id",
    verifyJWT,
    isAdmin,
    deleteBook
);

router.patch(
    "/:id/restore",
    verifyJWT,
    isAdmin,
    restoreBook
);

module.exports = router;