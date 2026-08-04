const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    borrowBookService,
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

module.exports = {
    borrowBook,
};