const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    addBookService,
    getAllBooksService,
    getBookByIdService,
    updateBookService,
    deleteBookService,
    restoreBookService,
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
        req.user._id,
        req.file
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
    const books = await getAllBooksService(
        req.query
    );
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

    const updatedBook = await updateBookService(id, req.body , req.file);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Book updated successfully.",
            updatedBook
        )
    );

});

const deleteBook = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await deleteBookService(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Book deleted successfully."
        )
    );

});

const restoreBook = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const book = await restoreBookService(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Book restored successfully.",
            book
        )
    );

});

module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    restoreBook,
};