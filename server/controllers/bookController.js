const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    addBookService,
    getAllBooksService,
} = require("../services/bookService");

const addBook = asyncHandler(async (req, res) => {

    const book = await addBookService(
        req.body,
        req.user._id
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Book added successfully.",
            book
        )
    );

});

const getAllBooks = asyncHandler(async (req, res) => {

    const books = await getAllBooksService();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Books fetched successfully.",
            books
        )
    );

});

module.exports = {
    addBook,
    getAllBooks,
};