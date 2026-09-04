const express = require("express");

const router = express.Router();
const isAdmin = require("../middleware/adminMiddleware");
const verifyJWT = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
    borrowBookValidator,
} = require("../validators/borrowValidator");

const {
    borrowBook,
    returnBook,
    payFine,
    getMyBorrowedBooks,
    getAllBorrowRecords,
    getMyBorrowStats,
    getAdminBorrowStats,
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

router.post(
    "/pay/:borrowId",
    verifyJWT,
    payFine
);

router.get(
    "/my",
    verifyJWT,
    getMyBorrowedBooks
);

router.get(
    "/",
    verifyJWT,
    isAdmin,
    getAllBorrowRecords
);

router.get(
    "/my/stats",
    verifyJWT,
    getMyBorrowStats
);

router.get(
    "/admin/stats",
    verifyJWT,
    isAdmin,
    getAdminBorrowStats
);

module.exports = router;