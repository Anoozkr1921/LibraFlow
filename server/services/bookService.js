const Book = require("../models/Book");
const ApiError = require("../utils/ApiError");

const getBookByIdService = async (id) => {

    const book = await Book.findById(id)
        .populate("createdBy", "name email");

    if (!book) {
        throw new ApiError(404, "Book not found.");
    }

    return book;
};

const addBookService = async (bookData, adminId) => {
    const existingBook = await Book.findOne({
        isbn: bookData.isbn,
    });

    if (existingBook) {
        throw new ApiError(400, "Book with this ISBN already exists.");
    }

    const book = await Book.create({
        ...bookData,
        availableCopies: bookData.totalCopies,
        createdBy: adminId,
    });

    return book;
};

const getAllBooksService = async () => {
    const books = await Book.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    return books;
};

const updateBookService = async (id, data) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid book ID.");
    }

    const book = await Book.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!book) {
        throw new ApiError(404, "Book not found.");
    }

    return book;
};

module.exports = {
    getBookByIdService,
    addBookService,
    getAllBooksService,
    updateBookService
};