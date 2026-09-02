const Book = require("../models/Book");

const retrieveBooks = async (question) => {
    const searchText = question
        .toLowerCase()
        .trim();

    if (!searchText) {
        return [];
    }

    // Search title, author, category,
    // description and publisher
    const books = await Book.find({
        isDeleted: false,
        $or: [
            {
                title: {
                    $regex: searchText,
                    $options: "i",
                },
            },
            {
                author: {
                    $regex: searchText,
                    $options: "i",
                },
            },
            {
                category: {
                    $regex: searchText,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: searchText,
                    $options: "i",
                },
            },
            {
                publisher: {
                    $regex: searchText,
                    $options: "i",
                },
            },
        ],
    })
        .select(
            "title author category description publisher publishedYear language availableCopies location"
        )
        .limit(5);

    return books;
};

module.exports = {
    retrieveBooks,
};