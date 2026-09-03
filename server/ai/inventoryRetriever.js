const Book = require("../models/Book");

const retrieveAllBooks = async () => {

    const books = await Book.find({
        isDeleted: false,
    })
        .select(
            "title author isbn category description publisher publishedYear language availableCopies location"
        )
        .sort({
            title: 1,
        });

    return books;
};


module.exports = {
    retrieveAllBooks,
};