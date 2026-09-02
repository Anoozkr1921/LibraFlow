const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const User = require("../models/User");
const calculateFine = require("../utils/fineCalculator");

// BORROW BOOK

const borrowBookService = async (studentId, bookId) => {

    // Step 1: Check if book exists
    const book = await Book.findById(bookId);

    if (!book) {
        throw new ApiError(404, "Book not found.");
    }
    // Step 2: Check book availability
    if (book.availableCopies <= 0) {
        throw new ApiError(
            400,
            "Book is currently unavailable."
        );
    }
    // Step 3: Prevent duplicate borrowing
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
    // Step 4: Set due date , Borrowing period = 14 days
    const dueDate = new Date();

    dueDate.setDate(
        dueDate.getDate() + 14
    );
    // Step 5: Create borrow record
    const borrow = await Borrow.create({
        student: studentId,
        book: bookId,
        dueDate,
    });
    // Step 6: Decrease available copies
    book.availableCopies--;

    await book.save();
    return borrow;
};
// RETURN BOOK

const returnBookService = async (borrowId) => {
    // Step 1: Validate Borrow ID
    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
        throw new ApiError(
            400,
            "Invalid Borrow ID."
        );
    }
    // Step 2: Find borrow record
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
        throw new ApiError(
            404,
            "Borrow record not found."
        );
    }
    // Step 3: Check if already returned
    if (borrow.status === "returned") {
        throw new ApiError(
            400,
            "Book already returned."
        );
    }
    // Step 4: Find the book
    const book = await Book.findById(
        borrow.book
    );
    if (!book) {
        throw new ApiError(
            404,
            "Book not found."
        );
    }
    // Step 5: Mark book as returned
    borrow.returnDate = new Date();

    borrow.status = "returned";
    // Step 6: Calculate fine

    const fineData = calculateFine(
        borrow.dueDate,
        borrow.returnDate
    );
    borrow.fine = fineData.fine;
    // Step 7: Save borrow record
    await borrow.save();

    book.availableCopies++;
    await book.save();
    return borrow;
};

const getMyBorrowedBooksService = async (studentId) => {

    // Find all borrow records belonging to student

    const borrows = await Borrow.find({
        student: studentId,
    })
        .populate("book")
        .sort({ createdAt: -1 });


    // Calculate current fine for every record

    const result = borrows.map((borrow) => {

        const fineData = calculateFine(
            borrow.dueDate,
            borrow.returnDate
        );


        return {
            ...borrow.toObject(),

            lateDays: fineData.lateDays,

            fine: borrow.status === "returned"
                ? borrow.fine
                : fineData.fine,
        };
    });


    return result;
};

const getAllBorrowRecordsService = async () => {

    // Get every borrow record

    const borrows = await Borrow.find()
        .populate(
            "student",
            "name email"
        )
        .populate(
            "book",
            "title author isbn"
        )
        .sort({ createdAt: -1 });


    // Calculate fine and late days

    const result = borrows.map((borrow) => {

        const fineData = calculateFine(
            borrow.dueDate,
            borrow.returnDate
        );


        return {
            ...borrow.toObject(),

            lateDays: fineData.lateDays,

            fine: borrow.status === "returned"
                ? borrow.fine
                : fineData.fine,
        };
    });


    return result;
};
// ======================================================
// GET MY BORROW STATISTICS
// ======================================================
const getMyBorrowStatsService = async (studentId) => {
    // Get all borrow records of this student
    const borrows = await Borrow.find({
        student: studentId,
    });
    // Total books ever borrowed

    const totalBorrowed = borrows.length;
    // Currently borrowed books

    const currentlyBorrowed = borrows.filter(
        (borrow) => borrow.status === "borrowed"
    ).length;
    // Returned books
    const returnedBooks = borrows.filter(
        (borrow) => borrow.status === "returned"
    ).length;
    // Calculate overdue books and total fine
    let overdueBooks = 0;
    let totalFine = 0;
    for (const borrow of borrows) {
        const fineData = calculateFine(
            borrow.dueDate,
            borrow.returnDate
        );
        // Overdue if lateDays > 0
        if (fineData.lateDays > 0) {
            overdueBooks++;
        }
        // For returned books, use the stored fine.
        // For active books, use the current calculated fine.
        if (borrow.status === "returned") {
            totalFine += borrow.fine || 0;
        } else {
            totalFine += fineData.fine;
        }
    }
    // Return statistics
    return {
        totalBorrowed,
        currentlyBorrowed,
        returnedBooks,
        overdueBooks,
        totalFine,
    };
};

const getAdminBorrowStatsService = async () => {

    // Get all borrow records
    const borrows = await Borrow.find();

    // Total number of book titles
    const totalBooks = await Book.countDocuments();

    // Get available copies
    const books = await Book.find()
        .select("availableCopies");

    const availableBooks = books.reduce(
        (total, book) => total + book.availableCopies,
        0
    );

    // Total users
    const totalUsers = await User.countDocuments();

    // Currently borrowed books
    const currentlyBorrowed = borrows.filter(
        (borrow) => borrow.status === "borrowed"
    ).length;

    // Overdue books
    let overdueBooks = 0;

    // Total fines
    let totalFines = 0;

    for (const borrow of borrows) {

        const fineData = calculateFine(
            borrow.dueDate,
            borrow.returnDate
        );

        // Count only currently borrowed books
        // that are actually overdue
        if (
            borrow.status === "borrowed" &&
            fineData.lateDays > 0
        ) {
            overdueBooks++;
        }

        // Returned books use their stored fine
        if (borrow.status === "returned") {

            totalFines += borrow.fine || 0;

        } else {

            // Active borrowed books use current fine
            totalFines += fineData.fine;
        }
    }
    return {
        totalBooks,
        availableBooks,
        currentlyBorrowed,
        overdueBooks,
        totalUsers,
        totalFines,
    };
};
module.exports = {
    borrowBookService,
    returnBookService,
    getMyBorrowedBooksService,
    getAllBorrowRecordsService,
    getMyBorrowStatsService,
    getAdminBorrowStatsService,
};