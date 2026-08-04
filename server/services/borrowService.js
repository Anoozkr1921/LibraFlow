const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const ApiError = require("../utils/ApiError");

const borrowBookService = async (studentId, bookId) => {

    // Step 1
    const book = await Book.findById(bookId);

    if (!book) {
        throw new ApiError(404, "Book not found.");
    }

    // Step 2
    if (book.availableCopies <= 0) {
        throw new ApiError(400, "Book is currently unavailable.");
    }

    // Step 3
    const alreadyBorrowed = await Borrow.findOne({
        student: studentId,
        book: bookId,
        status: "borrowed",
    });

    if (alreadyBorrowed) {
        throw new ApiError(
            400,
            "You have already borrowed this book."
        );
    }

    // Step 4
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Step 5
    const borrow = await Borrow.create({
        student: studentId,
        book: bookId,
        dueDate,
    });

    // Step 6
    book.availableCopies--;

    await book.save();

    return borrow;
};

module.exports = {
    borrowBookService,
};