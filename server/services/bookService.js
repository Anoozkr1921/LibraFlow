const Book = require("../models/Book");
const ApiError = require("../utils/ApiError");

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

module.exports = {
    addBookService,
    getAllBooksService,
};