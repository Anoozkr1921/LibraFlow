const Book = require("../models/Book");

const searchBooks = async ({
    title,
    author,
    category,
    isbn,
    availableOnly = false,
}) => {

    const query = {
        isDeleted: false,
    };

    if (title) {
        query.title = {
            $regex: title,
            $options: "i",
        };
    }

    if (author) {
        query.author = {
            $regex: author,
            $options: "i",
        };
    }

    if (category) {
        query.category = {
            $regex: `^${category}$`,
            $options: "i",
        };
    }

    if (isbn) {
        query.isbn = isbn;
    }

    if (availableOnly) {
        query.availableCopies = {
            $gt: 0,
        };
    }

    return await Book.find(query)
        .select(
            "title author isbn category description publisher publishedYear language availableCopies location"
        )
        .sort({
            title: 1,
        });
};

module.exports = {
    searchBooks,
};