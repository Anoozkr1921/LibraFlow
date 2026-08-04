const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    addBookService,
    getAllBooksService,
    getBookByIdService,
    updateBookService,
} = require("../services/bookService");

const getBookById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const book = await getBookByIdService(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Book fetched successfully.",
            book
        )
    );

});

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

const updateBook = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const updatedBook = await updateBookService(id, req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Book updated successfully.",
            updatedBook
        )
    );

});

module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
};