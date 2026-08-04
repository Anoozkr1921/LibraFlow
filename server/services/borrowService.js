const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

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

const returnBookService = async (borrowId) => {

    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
        throw new ApiError(400, "Invalid Borrow ID.");
    }

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
        throw new ApiError(404, "Borrow record not found.");
    }

    if (borrow.status === "returned") {
        throw new ApiError(400, "Book already returned.");
    }

    const book = await Book.findById(borrow.book);

    borrow.returnDate = new Date();
    borrow.status = "returned";

    // Fine calculation
    if (borrow.returnDate > borrow.dueDate) {

        const lateDays = Math.ceil(
            (borrow.returnDate - borrow.dueDate) /
            (1000 * 60 * 60 * 24)
        );

        borrow.fine = lateDays * 5; // ₹5/day

    }

    await borrow.save();

    book.availableCopies++;

    await book.save();

    return borrow;
};

module.exports = {
    borrowBookService,
    returnBookService,
};