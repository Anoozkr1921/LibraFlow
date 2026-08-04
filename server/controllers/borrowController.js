const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    borrowBookService,
    returnBookService,
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

module.exports = {
    borrowBook,
    returnBook,
};