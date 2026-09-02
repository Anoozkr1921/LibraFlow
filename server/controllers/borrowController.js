const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    borrowBookService,
    returnBookService,
    getMyBorrowedBooksService,
    getAllBorrowRecordsService,
    getMyBorrowStatsService,
    getAdminBorrowStatsService,
} = require("../services/borrowService");

const borrowBook = asyncHandler(async (req, res) => {

    const { bookId } = req.body;

    const borrow = await borrowBookService(
        req.user._id,
        bookId
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Book borrowed successfully.",
            borrow
        )
    );

});

const returnBook = asyncHandler(async (req, res) => {

    const { borrowId } = req.params;

    const borrow = await returnBookService(borrowId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Book returned successfully.",
            borrow
        )
    );

});

const getMyBorrowedBooks = asyncHandler(async (req, res) => {

    const borrows = await getMyBorrowedBooksService(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Borrow history fetched successfully.",
            borrows
        )
    );

});

const getAllBorrowRecords = asyncHandler(async (req, res) => {
    const borrows = await getAllBorrowRecordsService();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Borrow records fetched successfully.",
            borrows
        )
    );

});

const getMyBorrowStats = asyncHandler(async (req, res) => {

    const stats = await getMyBorrowStatsService(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Borrow statistics fetched successfully.",
            stats
        )
    );
});

const getAdminBorrowStats = asyncHandler(async (req, res) => {

    const stats = await getAdminBorrowStatsService();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Admin statistics fetched successfully.",
            stats
        )
    );
});

module.exports = {
    borrowBook,
    returnBook,
    getMyBorrowedBooks,
    getAllBorrowRecords,
    getMyBorrowStats,
    getAdminBorrowStats,
};